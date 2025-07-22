import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ONBOARDING', href: '/onboarding', icon: Users },
    { name: 'APPROVALS', href: '/approvals', icon: CheckCircle },
    { name: 'DOCUMENTS', href: '/documents', icon: FileText },
    { name: 'ANALYTICS', href: '/analytics', icon: BarChart3 },
    { name: 'SETTINGS', href: '/settings', icon: Settings },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (currentUser?.role === 'employee') {
      return ['DASHBOARD', 'DOCUMENTS', 'SETTINGS'].includes(item.name);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--paper)] flex">
      {/* Sidebar - Editorial Style */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white editorial-sidebar
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b-2 border-[var(--ink)]">
            <Link to="/dashboard" className="block">
              <h1 className="font-serif font-black text-2xl">TALENT PIPELINE</h1>
              <p className="caption mt-1">ENTERPRISE EDITION</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 font-sans font-medium text-sm tracking-wider
                    transition-all duration-150
                    ${isActive 
                      ? 'bg-[var(--ink)] text-white' 
                      : 'hover:bg-[var(--highlight)] text-[var(--ink)]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-6 border-t-2 border-[var(--border)]">
            <div className="mb-4">
              <p className="font-serif font-bold">{currentUser?.displayName}</p>
              <p className="caption">{currentUser?.role?.toUpperCase()} · {currentUser?.department}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <LogOut className="w-4 h-4" />
              SIGN OUT
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-2"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};