import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock data
  const metrics = {
    activeOnboardings: 23,
    pendingApprovals: 7,
    documentsProcessed: 156,
    timePerOnboarding: 24,
  };

  const recentActivity = [
    { id: 1, action: 'New employee onboarding initiated', user: 'Sarah Chen', time: '2 hours ago', status: 'in_progress' },
    { id: 2, action: 'Document verification completed', user: 'Michael Rodriguez', time: '3 hours ago', status: 'completed' },
    { id: 3, action: 'Approval request submitted', user: 'Jennifer Wu', time: '5 hours ago', status: 'pending' },
    { id: 4, action: 'Training module assigned', user: 'David Park', time: '1 day ago', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Dashboard Header - Newspaper Style */}
      <header className="border-b-2 border-[var(--ink)] bg-white">
        <div className="editorial-container py-8">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="caption text-[var(--accent)]">EXECUTIVE DASHBOARD</p>
              <h1 className="headline-lg mt-2">Operations Overview</h1>
              <p className="body-text mt-2">Welcome back, {currentUser?.displayName}</p>
            </div>
            <div className="text-right">
              <p className="caption">{currentDate}</p>
              <p className="caption text-[var(--accent)]">{currentUser?.role?.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Key Metrics - Editorial Style */}
      <section className="py-12 bg-white">
        <div className="editorial-container">
          <div className="editorial-grid">
            {/* Main Metrics */}
            <div className="col-span-12 lg:col-span-3">
              <div className="editorial-card border-2 border-[var(--ink)] h-full">
                <div className="flex justify-between items-start mb-4">
                  <Users className="w-8 h-8 text-[var(--accent)]" />
                  <span className="caption text-green-600">+12%</span>
                </div>
                <p className="stat-number">{metrics.activeOnboardings}</p>
                <p className="caption mt-2">ACTIVE ONBOARDINGS</p>
                <p className="body-text mt-1 text-sm">Currently in progress</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="editorial-card border-2 border-[var(--ink)] h-full">
                <div className="flex justify-between items-start mb-4">
                  <Clock className="w-8 h-8 text-[var(--accent)]" />
                  <span className="caption text-[var(--accent)]">URGENT</span>
                </div>
                <p className="stat-number text-[var(--accent)]">{metrics.pendingApprovals}</p>
                <p className="caption mt-2">PENDING APPROVALS</p>
                <p className="body-text mt-1 text-sm">Require attention</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="editorial-card border-2 border-[var(--ink)] h-full">
                <div className="flex justify-between items-start mb-4">
                  <FileText className="w-8 h-8 text-[var(--accent)]" />
                  <span className="caption text-green-600">+24%</span>
                </div>
                <p className="stat-number">{metrics.documentsProcessed}</p>
                <p className="caption mt-2">DOCUMENTS</p>
                <p className="body-text mt-1 text-sm">Processed this month</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="editorial-card border-2 border-[var(--ink)] h-full">
                <div className="flex justify-between items-start mb-4">
                  <TrendingUp className="w-8 h-8 text-[var(--accent)]" />
                  <span className="caption text-green-600">-65%</span>
                </div>
                <p className="stat-number">{metrics.timePerOnboarding}<span className="text-3xl">hr</span></p>
                <p className="caption mt-2">AVG. TIME</p>
                <p className="body-text mt-1 text-sm">Per onboarding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Feed - Editorial Style */}
      <section className="py-12">
        <div className="editorial-container">
          <div className="editorial-grid">
            {/* Recent Activity */}
            <div className="col-span-12 lg:col-span-8">
              <div className="mb-8">
                <h2 className="headline mb-2">Recent Activity</h2>
                <div className="w-20 h-1 bg-[var(--accent)]"></div>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="editorial-card flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-serif font-bold text-lg mb-1">{activity.action}</p>
                      <p className="body-text">
                        <span className="font-medium">{activity.user}</span>
                        <span className="mx-2 text-[var(--muted)]">·</span>
                        <span className="text-[var(--muted)]">{activity.time}</span>
                      </p>
                    </div>
                    <div>
                      {activity.status === 'completed' && (
                        <span className="caption text-green-600">COMPLETED</span>
                      )}
                      {activity.status === 'pending' && (
                        <span className="caption text-[var(--accent)]">PENDING</span>
                      )}
                      {activity.status === 'in_progress' && (
                        <span className="caption text-blue-600">IN PROGRESS</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button className="btn-editorial-outline">
                  VIEW ALL ACTIVITY →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="headline mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="btn-editorial w-full">
                    START NEW ONBOARDING
                  </button>
                  <button className="btn-editorial-outline w-full">
                    REVIEW APPROVALS
                  </button>
                  <button className="btn-editorial-outline w-full">
                    GENERATE REPORT
                  </button>
                </div>
              </div>

              {/* Insights */}
              <div className="editorial-card bg-[var(--highlight)]">
                <h4 className="font-serif font-bold text-xl mb-3">This Week's Insight</h4>
                <p className="body-text mb-4">
                  Your team has reduced average onboarding time by 18% compared to last month. 
                  The new automated document verification is showing significant impact.
                </p>
                <a href="#" className="text-[var(--accent)] font-medium hover:underline">
                  View detailed analytics →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Stats Bar */}
      <section className="py-6 bg-[var(--ink)] text-[var(--paper)]">
        <div className="editorial-container">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="caption">SYSTEM STATUS: OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="caption">NEXT REVIEW: TOMORROW 9AM</span>
              </div>
            </div>
            <div>
              <span className="caption">LAST SYNC: 2 MINUTES AGO</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};