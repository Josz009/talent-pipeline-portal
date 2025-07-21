import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { OnboardingTask } from '../types';

interface AnalyticsData {
  totalOnboardings: number;
  completedOnboardings: number;
  avgCompletionTime: number;
  timeSaved: number;
  costSavings: number;
  departmentMetrics: Array<{
    name: string;
    completed: number;
    pending: number;
    avgTime: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    started: number;
    completed: number;
    timeSaved: number;
  }>;
  bottlenecks: Array<{
    stage: string;
    avgDuration: number;
    delayCount: number;
  }>;
}

export const Analytics: React.FC = () => {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [exportFormat, setExportFormat] = useState('pdf');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = timeRange === '1month' 
        ? subMonths(endDate, 1)
        : timeRange === '3months'
        ? subMonths(endDate, 3)
        : subMonths(endDate, 6);

      const onboardingsQuery = query(
        collection(db, 'onboardings'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );

      const snapshot = await getDocs(onboardingsQuery);
      const onboardings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as OnboardingTask[];

      // Calculate metrics
      const totalOnboardings = onboardings.length;
      const completedOnboardings = onboardings.filter(o => o.status === 'completed' || o.status === 'approved').length;
      
      // Average completion time (in days)
      const completedWithTime = onboardings.filter(o => o.completedAt);
      const avgCompletionTime = completedWithTime.length > 0
        ? completedWithTime.reduce((acc, o) => {
            const start = o.createdAt.toDate ? o.createdAt.toDate() : o.createdAt;
            const end = o.completedAt!.toDate ? o.completedAt!.toDate() : o.completedAt!;
            return acc + ((end as any) - (start as any)) / (1000 * 60 * 60 * 24);
          }, 0) / completedWithTime.length
        : 0;

      // Time saved (assuming manual process takes 10 days vs automated 3 days)
      const timeSaved = completedOnboardings * 7 * 8; // 7 days saved * 8 hours per day

      // Cost savings (assuming $50/hour HR cost)
      const costSavings = timeSaved * 50;

      // Department metrics
      const departmentMap = new Map<string, { completed: number; pending: number; totalTime: number; count: number }>();
      onboardings.forEach(o => {
        if (!departmentMap.has(o.department)) {
          departmentMap.set(o.department, { completed: 0, pending: 0, totalTime: 0, count: 0 });
        }
        const dept = departmentMap.get(o.department)!;
        if (o.status === 'completed' || o.status === 'approved') {
          dept.completed++;
          if (o.completedAt) {
            const start = o.createdAt.toDate ? o.createdAt.toDate() : o.createdAt;
            const end = o.completedAt.toDate ? o.completedAt.toDate() : o.completedAt;
            dept.totalTime += ((end as any) - (start as any)) / (1000 * 60 * 60 * 24);
            dept.count++;
          }
        } else {
          dept.pending++;
        }
      });

      const departmentMetrics = Array.from(departmentMap.entries()).map(([name, data]) => ({
        name,
        completed: data.completed,
        pending: data.pending,
        avgTime: data.count > 0 ? data.totalTime / data.count : 0,
      }));

      // Monthly trends
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(endDate, i));
        const monthEnd = endOfMonth(subMonths(endDate, i));
        
        const monthOnboardings = onboardings.filter(o => {
          const date = o.createdAt.toDate ? o.createdAt.toDate() : o.createdAt;
          return date >= monthStart && date <= monthEnd;
        });

        monthlyTrends.push({
          month: format(monthStart, 'MMM'),
          started: monthOnboardings.length,
          completed: monthOnboardings.filter(o => o.status === 'completed' || o.status === 'approved').length,
          timeSaved: monthOnboardings.filter(o => o.status === 'completed' || o.status === 'approved').length * 7 * 8,
        });
      }

      // Bottlenecks (simulated data for demo)
      const bottlenecks = [
        { stage: 'Document Collection', avgDuration: 2.5, delayCount: 15 },
        { stage: 'Manager Approval', avgDuration: 1.8, delayCount: 8 },
        { stage: 'IT Setup', avgDuration: 1.2, delayCount: 5 },
        { stage: 'Orientation', avgDuration: 0.5, delayCount: 2 },
      ];

      return {
        totalOnboardings,
        completedOnboardings,
        avgCompletionTime,
        timeSaved,
        costSavings,
        departmentMetrics,
        monthlyTrends,
        bottlenecks,
      } as AnalyticsData;
    },
    enabled: !!currentUser,
  });

  const exportReport = () => {
    // In a real app, this would generate a PDF/Excel report
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      metrics: analytics,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  const completionRate = analytics
    ? (analytics.completedOnboardings / analytics.totalOnboardings) * 100
    : 0;

  const pieChartData = analytics?.departmentMetrics.map(dept => ({
    name: dept.name,
    value: dept.completed,
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
            Analytics & Reporting
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track performance metrics and generate insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: '1month', label: 'Last Month' },
              { value: '3months', label: 'Last 3 Months' },
              { value: '6months', label: 'Last 6 Months' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          />
          <Button variant="primary" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Onboardings',
            value: analytics?.totalOnboardings || 0,
            change: '+23%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          },
          {
            title: 'Completion Rate',
            value: `${completionRate.toFixed(1)}%`,
            change: '+5%',
            changeType: 'positive' as const,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
          },
          {
            title: 'Hours Saved',
            value: analytics?.timeSaved.toLocaleString() || '0',
            change: '+18%',
            changeType: 'positive' as const,
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          },
          {
            title: 'Cost Savings',
            value: `$${(analytics?.costSavings || 0).toLocaleString()}`,
            change: '+32%',
            changeType: 'positive' as const,
            icon: DollarSign,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <div className="mt-2 flex items-center">
                      {metric.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          metric.changeType === 'positive'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {metric.change}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        vs last period
                      </span>
                    </div>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Onboarding Trends
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly started vs completed
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="started"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Started"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Department Distribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completed onboardings by department
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Savings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Time Savings Analysis
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hours saved per month through automation
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="timeSaved" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Hours Saved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottlenecks */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Process Bottlenecks
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Average duration by stage (days)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.bottlenecks || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="stage" type="category" stroke="#6b7280" width={100} />
                <Tooltip />
                <Bar dataKey="avgDuration" fill="#ef4444" name="Avg Duration (days)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Department Performance Summary
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Avg Time (days)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {analytics?.departmentMetrics.map((dept) => {
                  const total = dept.completed + dept.pending;
                  const efficiency = total > 0 ? (dept.completed / total) * 100 : 0;
                  
                  return (
                    <tr key={dept.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {dept.completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {dept.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {dept.avgTime.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {efficiency.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};