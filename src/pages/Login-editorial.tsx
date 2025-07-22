import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      {/* Minimal Header */}
      <header className="py-6 border-b border-[var(--ink)]">
        <div className="editorial-container">
          <Link to="/" className="inline-block">
            <h1 className="font-serif font-black text-2xl tracking-tight">TALENT PIPELINE</h1>
          </Link>
        </div>
      </header>

      {/* Login Form - Editorial Style */}
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="editorial-card border-2 border-[var(--ink)]">
            <div className="text-center mb-8">
              <p className="caption text-[var(--accent)] mb-2">MEMBER ACCESS</p>
              <h2 className="headline">Sign In</h2>
              <p className="body-text mt-2 text-[var(--muted)]">
                Access your enterprise HR platform
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[var(--accent)] text-white">
                <p className="font-sans text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="caption block mb-2">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="input-editorial pl-10"
                    placeholder="admin@talentpipeline.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--accent)]">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="caption block mb-2">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type="password"
                    className="input-editorial pl-10"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-[var(--accent)]">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-editorial w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    'AUTHENTICATING...'
                  ) : (
                    <>
                      ACCESS PLATFORM
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
              <p className="body-text">
                New to Talent Pipeline?{' '}
                <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">
                  Request Access
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials - Editorial Style */}
          <div className="mt-8 editorial-card bg-[var(--highlight)]">
            <p className="caption mb-3">DEMONSTRATION CREDENTIALS</p>
            <div className="space-y-2 font-mono text-sm">
              <p>admin@talentpipeline.com / admin123</p>
              <p>manager@talentpipeline.com / manager123</p>
              <p>employee@talentpipeline.com / employee123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t-2 border-[var(--ink)]">
        <div className="editorial-container text-center">
          <p className="caption">
            © {currentYear} TALENT PIPELINE · ENTERPRISE EDITION · 
            <a href="#" className="ml-2 hover:text-[var(--accent)]">PRIVACY</a> · 
            <a href="#" className="ml-2 hover:text-[var(--accent)]">TERMS</a>
          </p>
        </div>
      </footer>
    </div>
  );
};