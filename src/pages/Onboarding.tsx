import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useOnboarding } from '../hooks/useOnboarding';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Briefcase,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Calendar,
  Building,
} from 'lucide-react';

interface OnboardingFormData {
  // Step 1: Employee Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Step 2: Position Details
  department: string;
  position: string;
  startDate: string;
  employmentType: string;
  
  // Step 3: Documents
  documents: FileList;
  
  // Step 4: Review
  agreedToTerms: boolean;
}

const steps = [
  { title: 'Employee Information', icon: User },
  { title: 'Position Details', icon: Briefcase },
  { title: 'Document Upload', icon: FileText },
  { title: 'Review & Submit', icon: CheckCircle },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<OnboardingFormData>();

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
  ];

  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields as any);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
      case 1:
        return ['department', 'position', 'startDate', 'employmentType'];
      case 2:
        return ['documents'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await createOnboarding.mutateAsync({
        employeeName: `${data.firstName} ${data.lastName}`,
        employeeEmail: data.email,
        department: data.department,
        position: data.position,
        startDate: new Date(data.startDate),
      });
      
      navigate('/onboarding/success');
    } catch (error) {
      console.error('Failed to submit onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formData = watch();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          New Employee Onboarding
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Complete the onboarding process for new team members
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index <= currentStep
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {step.title}
                </span>
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-0.5 mx-4 transition-colors ${
                    index < currentStep
                      ? 'bg-primary-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Employee Information */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      {...register('firstName', { required: 'First name is required' })}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Last Name"
                      {...register('lastName', { required: 'Last name is required' })}
                      error={errors.lastName?.message}
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    error={errors.dateOfBirth?.message}
                  />
                </motion.div>
              )}

              {/* Step 2: Position Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Select
                    label="Department"
                    options={departmentOptions}
                    {...register('department', { required: 'Department is required' })}
                    error={errors.department?.message}
                  />
                  <Input
                    label="Position Title"
                    {...register('position', { required: 'Position is required' })}
                    error={errors.position?.message}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    {...register('startDate', { required: 'Start date is required' })}
                    error={errors.startDate?.message}
                  />
                  <Select
                    label="Employment Type"
                    options={employmentTypeOptions}
                    {...register('employmentType', { required: 'Employment type is required' })}
                    error={errors.employmentType?.message}
                  />
                </motion.div>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop files here, or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      {...register('documents')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                    >
                      Select Files
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Required Documents:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Government-issued ID</li>
                      <li>• Social Security Card</li>
                      <li>• Educational Certificates</li>
                      <li>• Previous Employment Verification</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Review Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Department</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {departmentOptions.find(d => d.value === formData.department)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Position</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Employment Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employmentTypeOptions.find(e => e.value === formData.employmentType)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      {...register('agreedToTerms', { required: 'You must agree to the terms' })}
                    />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      I confirm that all the information provided is accurate and complete.
                      I understand that this information will be used for employment purposes.
                    </label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.agreedToTerms.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting}>
                  Submit Onboarding
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};