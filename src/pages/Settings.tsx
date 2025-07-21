import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { initializeFirebaseData, checkDemoData } from '../services/firebase-init';
import {
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Database,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  const handleInitializeData = async () => {
    setIsInitializing(true);
    setInitMessage('');
    
    try {
      const dataExists = await checkDemoData();
      if (dataExists) {
        setInitMessage('Demo data already exists!');
      } else {
        await initializeFirebaseData();
        setInitMessage('Demo data created successfully! You can now log in with the demo credentials.');
      }
    } catch (error) {
      setInitMessage('Error initializing data. Please check the console.');
      console.error(error);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentUser?.displayName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentUser?.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <Badge variant="default" className="mt-1">
                {currentUser?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Appearance
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Enable' : 'Disable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email updates for approvals
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Browser notifications for urgent tasks
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Data Initialization */}
      {currentUser?.role === 'admin' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Demo Data Management
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Initialize the Firebase database with demo users and onboarding data. This will create:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                  <li>• 3 demo users (admin, manager, employee)</li>
                  <li>• Sample onboarding tasks</li>
                  <li>• Example documents and approvals</li>
                </ul>
                <Button
                  variant="primary"
                  onClick={handleInitializeData}
                  isLoading={isInitializing}
                  disabled={isInitializing}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Initialize Demo Data
                </Button>
              </div>
              
              {initMessage && (
                <div className={`flex items-center p-3 rounded-lg ${
                  initMessage.includes('success') 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : initMessage.includes('already exists')
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {initMessage.includes('success') ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2" />
                  )}
                  <p className="text-sm">{initMessage}</p>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Demo Credentials:
                </p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p><strong>Admin:</strong> admin@talentpipeline.com / admin123</p>
                  <p><strong>Manager:</strong> manager@talentpipeline.com / manager123</p>
                  <p><strong>Employee:</strong> employee@talentpipeline.com / employee123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};