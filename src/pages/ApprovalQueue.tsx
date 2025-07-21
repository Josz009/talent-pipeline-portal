import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckSquare,
  Square,
  Filter,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingTask, Approval } from '../types';

interface ApprovalItem extends OnboardingTask {
  selected?: boolean;
}

export const ApprovalQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentApprovalId, setCurrentApprovalId] = useState<string | null>(null);

  const { data: approvals, isLoading } = useQuery({
    queryKey: ['approvals', currentUser?.id, filterStatus],
    queryFn: async () => {
      let q = query(
        collection(db, 'onboardings'),
        where('approvals', 'array-contains', {
          approverId: currentUser?.id,
          status: filterStatus === 'all' ? 'pending' : filterStatus,
        }),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ApprovalItem[];
    },
    enabled: !!currentUser,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ 
      ids, 
      status, 
      comment 
    }: { 
      ids: string[]; 
      status: 'approved' | 'rejected'; 
      comment?: string 
    }) => {
      const batch = writeBatch(db);
      
      ids.forEach(id => {
        const docRef = doc(db, 'onboardings', id);
        const approval: Approval = {
          id: crypto.randomUUID(),
          approverId: currentUser!.id,
          approverName: currentUser!.displayName,
          approverRole: currentUser!.role,
          status,
          comments: comment,
          timestamp: new Date(),
        };

        batch.update(docRef, {
          approvals: [...(approvals?.find(a => a.id === id)?.approvals || []), approval],
          status: status === 'approved' ? 'approved' : 'rejected',
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      setSelectedItems(new Set());
      setShowCommentModal(false);
      setComment('');
    },
  });

  const handleSelectAll = () => {
    if (selectedItems.size === approvals?.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(approvals?.map(a => a.id) || []));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkApprove = () => {
    if (selectedItems.size === 0) return;
    approveMutation.mutate({
      ids: Array.from(selectedItems),
      status: 'approved',
    });
  };

  const handleBulkReject = () => {
    if (selectedItems.size === 0) return;
    setShowCommentModal(true);
  };

  const handleSingleAction = (id: string, status: 'approved' | 'rejected') => {
    setCurrentApprovalId(id);
    if (status === 'rejected') {
      setShowCommentModal(true);
    } else {
      approveMutation.mutate({
        ids: [id],
        status: 'approved',
      });
    }
  };

  const submitRejection = () => {
    const ids = currentApprovalId ? [currentApprovalId] : Array.from(selectedItems);
    approveMutation.mutate({
      ids,
      status: 'rejected',
      comment,
    });
  };

  const pendingCount = approvals?.filter(a => 
    a.approvals?.some(ap => ap.approverId === currentUser?.id && ap.status === 'pending')
  ).length || 0;

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
            Approval Queue
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review and approve onboarding requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {filterStatus === 'pending' && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  {selectedItems.size === approvals?.length && approvals?.length > 0 ? (
                    <CheckSquare className="w-4 h-4 mr-2" />
                  ) : (
                    <Square className="w-4 h-4 mr-2" />
                  )}
                  Select All ({selectedItems.size} selected)
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkReject}
                  disabled={selectedItems.size === 0}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Selected
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={selectedItems.size === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Items */}
      <div className="space-y-4">
        <AnimatePresence>
          {approvals?.map((approval, index) => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {filterStatus === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(approval.id)}
                          onChange={() => handleSelectItem(approval.id)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                            {approval.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {approval.employeeName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {approval.employeeEmail}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FileText className="w-4 h-4 mr-2" />
                            {approval.position}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            Start: {format(approval.startDate.toDate ? approval.startDate.toDate() : approval.startDate, 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            Submitted: {format(approval.createdAt.toDate ? approval.createdAt.toDate() : approval.createdAt, 'MMM dd, yyyy')}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {Math.round((approval.currentStep / approval.totalSteps) * 100)}%
                            </span>
                          </div>
                          <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(approval.currentStep / approval.totalSteps) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Documents ({approval.documents?.length || 0})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {approval.documents?.map((doc) => (
                              <Badge key={doc.id} variant="default" size="sm">
                                <FileText className="w-3 h-3 mr-1" />
                                {doc.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      {filterStatus === 'pending' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSingleAction(approval.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSingleAction(approval.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant={
                            approval.status === 'approved'
                              ? 'success'
                              : approval.status === 'rejected'
                              ? 'danger'
                              : 'default'
                          }
                        >
                          {approval.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Previous Approvals */}
                  {approval.approvals && approval.approvals.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Approval History
                      </p>
                      <div className="space-y-2">
                        {approval.approvals.map((ap) => (
                          <div
                            key={ap.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {ap.approverName} ({ap.approverRole})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  ap.status === 'approved'
                                    ? 'success'
                                    : ap.status === 'rejected'
                                    ? 'danger'
                                    : 'warning'
                                }
                                size="sm"
                              >
                                {ap.status}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(ap.timestamp.toDate ? ap.timestamp.toDate() : ap.timestamp, 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {approvals?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No {filterStatus === 'all' ? '' : filterStatus} approvals found
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Rejection Reason
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCommentModal(false);
                    setComment('');
                    setCurrentApprovalId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={submitRejection}
                  isLoading={approveMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};