import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Briefcase } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Talent Pipeline Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enterprise HR Automation Platform
          </p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sign in to your account</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
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
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between">
                <Link
                  to="/signup"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Create an account
                </Link>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Demo Credentials</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Admin:</strong> admin@talentpipeline.com / admin123</p>
                <p><strong>Manager:</strong> manager@talentpipeline.com / manager123</p>
                <p><strong>Employee:</strong> employee@talentpipeline.com / employee123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};