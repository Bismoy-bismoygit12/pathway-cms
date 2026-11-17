import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { CmsProvider } from '@/context/CmsContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { UserDetail } from '@/pages/UserDetail';
import { Doctors } from '@/pages/Doctors';
import { DoctorDetail } from '@/pages/DoctorDetail';
import { Appointments } from '@/pages/Appointments';
import { Analytics } from '@/pages/Analytics';
import { ActivityLogs } from '@/pages/ActivityLogs';
import { Settings } from '@/pages/Settings';
import { HomepageEditor } from '@/pages/website/HomepageEditor';
import { NavigationEditor } from '@/pages/website/NavigationEditor';
import { AboutEditor } from '@/pages/website/AboutEditor';
import { ContactEditor } from '@/pages/website/ContactEditor';
import { FaqManager } from '@/pages/website/FaqManager';
import { ArticleManager } from '@/pages/website/ArticleManager';
import { MediaLibrary } from '@/pages/website/MediaLibrary';
import { FooterEditor } from '@/pages/website/FooterEditor';
import { SeoManager } from '@/pages/website/SeoManager';
import { SitePreviewModal } from '@/components/cms/SitePreviewModal';
import { Unauthorized } from '@/components/common/ModulePlaceholder';
import { PermissionKey } from '@/types/admin';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RequirePermission: React.FC<{ permission: PermissionKey; children: React.ReactNode }> = ({
  permission,
  children,
}) => {
  const { hasPermission } = useAdminAuth();
  if (!hasPermission(permission)) return <Unauthorized />;
  return <>{children}</>;
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminAuthProvider>
          <CmsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                {/* Platform Management Routes */}
                <Route
                  path="/"
                  element={
                    <RequirePermission permission="dashboard:view">
                      <Dashboard />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RequirePermission permission="users:view">
                      <Users />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <RequirePermission permission="users:view">
                      <UserDetail />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/doctors"
                  element={
                    <RequirePermission permission="doctors:view">
                      <Doctors />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/doctors/:id"
                  element={
                    <RequirePermission permission="doctors:view">
                      <DoctorDetail />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <RequirePermission permission="appointments:view">
                      <Appointments />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <RequirePermission permission="analytics:view">
                      <Analytics />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/activity-logs"
                  element={
                    <RequirePermission permission="logs:view">
                      <ActivityLogs />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequirePermission permission="settings:manage">
                      <Settings />
                    </RequirePermission>
                  }
                />

                {/* Website CMS Routes */}
                <Route
                  path="/website/homepage"
                  element={
                    <RequirePermission permission="cms:view">
                      <HomepageEditor />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/navigation"
                  element={
                    <RequirePermission permission="cms:view">
                      <NavigationEditor />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/about"
                  element={
                    <RequirePermission permission="cms:view">
                      <AboutEditor />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/contact"
                  element={
                    <RequirePermission permission="cms:view">
                      <ContactEditor />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/faqs"
                  element={
                    <RequirePermission permission="cms:view">
                      <FaqManager />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/articles"
                  element={
                    <RequirePermission permission="cms:view">
                      <ArticleManager />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/media"
                  element={
                    <RequirePermission permission="media:manage">
                      <MediaLibrary />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/footer"
                  element={
                    <RequirePermission permission="cms:view">
                      <FooterEditor />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/website/seo"
                  element={
                    <RequirePermission permission="cms:view">
                      <SeoManager />
                    </RequirePermission>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            <SitePreviewModal />
          </CmsProvider>
        </AdminAuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
