import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { initializeFirebaseData, checkDemoData } from '../services/firebase-init';
import { CheckCircle, AlertCircle, Loader, Users, Sparkles } from 'lucide-react';

export const Setup: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'creating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSetup = async () => {
    setStatus('checking');
    setMessage('Checking for existing demo data...');
    addLog('Starting setup process...');

    try {
      const exists = await checkDemoData();
      
      if (exists) {
        setStatus('success');
        setMessage('Demo data already exists! You can login now.');
        addLog('Demo data found - setup not needed');
        return;
      }

      setStatus('creating');
      setMessage('Creating demo users...');
      addLog('No demo data found - creating new users...');

      await initializeFirebaseData();
      
      setStatus('success');
      setMessage('Setup complete! Demo users created successfully.');
      addLog('✅ All demo users created successfully!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Setup failed: ${error.message}`);
      addLog(`❌ Error: ${error.message}`);
      
      if (error.code === 'auth/admin-restricted-operation') {
        addLog('⚠️ Make sure Email/Password auth is enabled in Firebase Console');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob dark:bg-blue-600 dark:opacity-20" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000 dark:bg-purple-600 dark:opacity-20" />
      </div>

      <div className="max-w-2xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="modern-card">
            <CardHeader className="text-center pb-2">
              <motion.div 
                className="flex justify-center mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Demo Setup</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create demo users to explore the Talent Pipeline Portal
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Display */}
              <div className="text-center">
                {status === 'idle' && (
                  <div className="text-gray-600 dark:text-gray-400">
                    Ready to create demo accounts
                  </div>
                )}
                {status === 'checking' && (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Loader className="h-5 w-5 animate-spin" />
                    {message}
                  </div>
                )}
                {status === 'creating' && (
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Loader className="h-5 w-5 animate-spin" />
                    {message}
                  </div>
                )}
                {status === 'success' && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    {message}
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    {message}
                  </div>
                )}
              </div>

              {/* Demo Users Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Demo Users to be Created:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between px-3 py-2 bg-white dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium text-purple-600 dark:text-purple-400">Admin</span>
                    <span className="text-gray-600 dark:text-gray-400">admin@talentpipeline.com / admin123</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 bg-white dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Manager</span>
                    <span className="text-gray-600 dark:text-gray-400">manager@talentpipeline.com / manager123</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 bg-white dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium text-green-600 dark:text-green-400">Employee</span>
                    <span className="text-gray-600 dark:text-gray-400">employee@talentpipeline.com / employee123</span>
                  </div>
                </div>
              </div>

              {/* Setup Log */}
              {log.length > 0 && (
                <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <div className="font-mono text-xs text-gray-300 space-y-1">
                    {log.map((entry, i) => (
                      <div key={i}>{entry}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleSetup}
                  disabled={status === 'checking' || status === 'creating'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {status === 'checking' || status === 'creating' ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : status === 'success' ? (
                    'Setup Complete!'
                  ) : (
                    'Create Demo Users'
                  )}
                </Button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      onClick={() => window.location.href = '/login'}
                      variant="outline"
                      className="w-full"
                    >
                      Go to Login →
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Prerequisites */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="font-semibold">Prerequisites:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Firebase Authentication must be enabled</li>
                  <li>Email/Password sign-in method must be enabled</li>
                  <li>Firestore database must be created</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};