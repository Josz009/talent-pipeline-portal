import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Briefcase, CheckCircle, Users, FileText, BarChart, Shield } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Talent Pipeline Portal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Enterprise-grade HR automation platform that saves 70% of your time through intelligent workflows
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Smart Onboarding"
              description="Automated workflows guide new employees through the entire onboarding process"
            />
            <FeatureCard
              icon={FileText}
              title="Document Management"
              description="Secure storage and intelligent processing of employee documents"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Approval Workflows"
              description="Multi-level approval chains with real-time notifications"
            />
            <FeatureCard
              icon={BarChart}
              title="Analytics Dashboard"
              description="Real-time insights into HR metrics and process efficiency"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Bank-level encryption and role-based access control"
            />
            <FeatureCard
              icon={Briefcase}
              title="70% Time Savings"
              description="Proven automation that reduces manual HR tasks significantly"
            />
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
              Demo Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">Admin User</p>
                <p className="text-blue-700 dark:text-blue-400">admin@talentpipeline.com</p>
                <p className="text-blue-700 dark:text-blue-400">admin123</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">Manager User</p>
                <p className="text-blue-700 dark:text-blue-400">manager@talentpipeline.com</p>
                <p className="text-blue-700 dark:text-blue-400">manager123</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">Employee User</p>
                <p className="text-blue-700 dark:text-blue-400">employee@talentpipeline.com</p>
                <p className="text-blue-700 dark:text-blue-400">employee123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};