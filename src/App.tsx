import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { OnboardingList } from './pages/OnboardingList';
import { Onboarding } from './pages/Onboarding';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { Documents } from './pages/Documents';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/onboarding"
                element={
                  <PrivateRoute allowedRoles={['admin', 'manager']}>
                    <Layout>
                      <OnboardingList />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/onboarding/new"
                element={
                  <PrivateRoute allowedRoles={['admin', 'manager']}>
                    <Layout>
                      <Onboarding />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/approvals"
                element={
                  <PrivateRoute allowedRoles={['admin', 'manager']}>
                    <Layout>
                      <ApprovalQueue />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/documents"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Documents />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/analytics"
                element={
                  <PrivateRoute allowedRoles={['admin', 'manager']}>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PrivateRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
