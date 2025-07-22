import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Users, FileText, BarChart, Shield, ArrowRight, Sparkles, Zap, Globe, TrendingUp, Award } from 'lucide-react';

export const Landing: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Simple Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Briefcase className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-6xl sm:text-7xl font-black mb-6"
            {...fadeIn}
          >
            <span className="gradient-text">Talent Pipeline</span>
            <br />
            <span className="text-gray-900 dark:text-white">Portal</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-medium"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            Transform your HR operations with AI-powered automation.
            <span className="block mt-2 text-lg">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">
                <Zap className="h-4 w-4" />
                Save 70% of your time
              </span>
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link to="/login">
              <Button 
                variant="primary" 
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Create Free Account
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            {...fadeIn}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">70%</div>
              <div className="text-gray-600 dark:text-gray-400">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </motion.div>
        </motion.div>
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
              gradient="from-blue-500 to-purple-600"
            />
            <FeatureCard
              icon={FileText}
              title="Document Management"
              description="Secure storage and intelligent processing of employee documents"
              gradient="from-green-500 to-teal-600"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Approval Workflows"
              description="Multi-level approval chains with real-time notifications"
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={BarChart}
              title="Analytics Dashboard"
              description="Real-time insights into HR metrics and process efficiency"
              gradient="from-orange-500 to-red-600"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Bank-level encryption and role-based access control"
              gradient="from-indigo-500 to-blue-600"
            />
            <FeatureCard
              icon={Briefcase}
              title="70% Time Savings"
              description="Proven automation that reduces manual HR tasks significantly"
              gradient="from-cyan-500 to-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="modern-card p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Try It Now</span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Experience the future of HR automation with our demo accounts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { role: "Admin", email: "admin@talentpipeline.com", icon: Award, color: "from-purple-500 to-pink-500" },
                { role: "Manager", email: "manager@talentpipeline.com", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
                { role: "Employee", email: "employee@talentpipeline.com", icon: Users, color: "from-green-500 to-teal-500" }
              ].map((demo, index) => (
                <motion.div
                  key={demo.role}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${demo.color} mb-4`}>
                    <demo.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{demo.role} User</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{demo.email}</p>
                  <p className="text-sm font-mono text-gray-500 dark:text-gray-500">Password: admin123</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/login">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Start Demo Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="group relative h-full">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" 
           style={{ backgroundImage: `linear-gradient(135deg, ${gradient.replace('from-', '').replace('to-', ', ')})` }} />
      <div className="relative h-full modern-card p-8 hover:border-transparent transition-all duration-300">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};