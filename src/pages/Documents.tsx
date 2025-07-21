import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  Check,
  X,
  Search,
  Filter,
  FolderOpen,
  Calendar,
  User,
  FileCheck,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { storage, db } from '../lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Document } from '../types';

interface DocumentWithId extends Document {
  id: string;
  size?: number;
  category?: string;
}

const documentCategories = [
  { value: 'all', label: 'All Documents', icon: FolderOpen },
  { value: 'personal', label: 'Personal', icon: User },
  { value: 'education', label: 'Education', icon: FileCheck },
  { value: 'employment', label: 'Employment', icon: FileText },
  { value: 'legal', label: 'Legal', icon: AlertCircle },
];

export const Documents: React.FC = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithId | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', currentUser?.id, categoryFilter],
    queryFn: async () => {
      let q = query(
        collection(db, 'documents'),
        orderBy('uploadedAt', 'desc')
      );

      if (categoryFilter !== 'all') {
        q = query(q, where('category', '==', categoryFilter));
      }

      if (currentUser?.role === 'employee') {
        q = query(q, where('uploadedBy', '==', currentUser.id));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DocumentWithId[];
    },
    enabled: !!currentUser,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `documents/${currentUser?.id}/${fileName}`);
      
      setUploadProgress(0);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const documentData: Omit<Document, 'id'> = {
        name: file.name,
        type: file.type,
        url: downloadURL,
        uploadedAt: new Date(),
        uploadedBy: currentUser!.id,
        status: 'pending',
        category: getCategoryFromType(file.type, file.name),
      };

      const docRef = await addDoc(collection(db, 'documents'), {
        ...documentData,
        uploadedAt: Timestamp.now(),
        size: file.size,
      });
      
      setUploadProgress(null);
      return { id: docRef.id, ...documentData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (document: DocumentWithId) => {
      // Delete from storage
      const storageRef = ref(storage, document.url);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', document.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      documentId, 
      status 
    }: { 
      documentId: string; 
      status: 'approved' | 'rejected' 
    }) => {
      await updateDoc(doc(db, 'documents', documentId), {
        status,
        reviewedBy: currentUser!.id,
        reviewedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const getCategoryFromType = (type: string, name: string): string => {
    if (name.toLowerCase().includes('resume') || name.toLowerCase().includes('cv')) {
      return 'employment';
    }
    if (name.toLowerCase().includes('degree') || name.toLowerCase().includes('certificate')) {
      return 'education';
    }
    if (name.toLowerCase().includes('id') || name.toLowerCase().includes('passport')) {
      return 'personal';
    }
    if (name.toLowerCase().includes('contract') || name.toLowerCase().includes('agreement')) {
      return 'legal';
    }
    return 'personal';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      uploadMutation.mutate(file);
    });
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Document Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload, manage, and review employee documents
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>

          {uploadProgress !== null && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {documentCategories.map((category) => (
                <Button
                  key={category.value}
                  variant={categoryFilter === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(category.value)}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDocuments?.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {document.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {document.size && formatFileSize(document.size)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(document.status)} size="sm">
                      {getStatusIcon(document.status)}
                      <span className="ml-1">{document.status}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(document.uploadedAt.toDate ? document.uploadedAt.toDate() : document.uploadedAt, 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <User className="w-3 h-3 mr-1" />
                      Uploaded by {currentUser?.id === document.uploadedBy ? 'You' : 'Employee'}
                    </div>
                    {document.reviewedBy && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FileCheck className="w-3 h-3 mr-1" />
                        Reviewed {format(document.reviewedAt?.toDate ? document.reviewedAt.toDate() : document.reviewedAt!, 'MMM dd')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(document.url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = document.url;
                          a.download = document.name;
                          a.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {(currentUser?.role === 'admin' || currentUser?.id === document.uploadedBy) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(document)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    {currentUser?.role !== 'employee' && document.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({
                            documentId: document.id,
                            status: 'approved',
                          })}
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({
                            documentId: document.id,
                            status: 'rejected',
                          })}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDocuments?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No documents found. Upload your first document to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};