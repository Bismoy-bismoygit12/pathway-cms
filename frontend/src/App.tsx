import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoProvider } from './context/DemoContext';

// Layout & Common Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { QuickExitButton } from './components/common/QuickExit';
import { GetHelpModal } from './components/common/GetHelpModal';
import { CookieBanner } from './components/common/CookieBanner';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SessionTimeoutModal } from './components/common/SessionTimeoutModal';
import { DemoControlsDrawer } from './components/common/DemoControlsDrawer';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';

// Public & Information Pages
import { Home as HomePage } from './pages/Home';
import { Emergency as EmergencyPage } from './pages/Emergency';
import { Pricing as PricingPage } from './pages/Pricing';
import { HowItWorks as HowItWorksPage } from './pages/HowItWorks';
import { About as AboutPage } from './pages/About';
import { Faq as FaqPage } from './pages/Faq';
import { Contact as ContactPage } from './pages/Contact';
import { PrivacyPolicy as PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { Terms as TermsPage } from './pages/Terms';
import { CookiePolicy as CookiePolicyPage } from './pages/CookiePolicy';
import { WeatherQuickExitPage } from './pages/WeatherQuickExitPage';

// Auth Pages
import { Login as LoginPage } from './pages/Login';
import { SignUp as SignUpPage } from './pages/SignUp';
import { ForgotPassword as ForgotPasswordPage } from './pages/ForgotPassword';

// Directory & Educational Pages
import { FindPsychiatrist as FindPsychiatristPage } from './pages/FindPsychiatrist';
import { DoctorProfile as DoctorProfilePage } from './pages/DoctorProfile';
import { Library as LibraryPage } from './pages/Library';
import { ArticleDetail as ArticleDetailPage } from './pages/ArticleDetail';

// Logged-in User Portal Pages
import { Dashboard as DashboardPage } from './pages/Dashboard';
import { DailyGoals as DailyGoalsPage } from './pages/DailyGoals';
import { Appointments as AppointmentsPage } from './pages/Appointments';
import { BookVisit as BookVisitPage } from './pages/BookVisit';
import { WaitingRoom as WaitingRoomPage } from './pages/WaitingRoom';
import { VideoCall as VideoCallPage } from './pages/VideoCall';
import { PostVisit as PostVisitPage } from './pages/PostVisit';
import { MedicalReports as MedicalReportsPage } from './pages/MedicalReports';
import { Progress as ProgressPage } from './pages/Progress';
import { Rewards as RewardsPage } from './pages/Rewards';
import { Chat as ChatPage } from './pages/Chat';
import { Profile as ProfilePage } from './pages/Profile';
import { RelapseSupport as RelapseSupportPage } from './pages/RelapseSupport';
import { SubscriptionPage } from './pages/Subscription';
import { PaymentGatewayPage } from './pages/PaymentGateway';
import { NotificationsPage } from './pages/NotificationsPage';
import { CommunityPage } from './pages/Community';
import { AccountStatusNotice } from './pages/AccountStatusNotice';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Handle paused, locked, or pending deletion accounts
  if (currentUser.status === 'paused') {
    return <AccountStatusNotice status="paused" />;
  }
  if (currentUser.status === 'pending_deletion') {
    return <AccountStatusNotice status="pending_deletion" />;
  }
  if (currentUser.status === 'locked') {
    return <AccountStatusNotice status="locked" />;
  }

  return <>{children}</>;
};

// Main App Container handling layout framing
const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Determine if this is a video call (hide normal header/footer/chat overlay for distraction-free consultation)
  const isVideoCallRoute = location.pathname.startsWith('/video-call/');
  const isWeatherExitRoute = location.pathname === '/weather-forecast';

  if (isWeatherExitRoute) {
    return <WeatherQuickExitPage />;
  }

  // Check if current route is a logged-in portal page
  const portalPaths = [
    '/my-day',
    '/goals',
    '/visits',
    '/reports',
    '/progress',
    '/rewards',
    '/me',
    '/subscription',
    '/notifications',
    '/community',
    '/relapse-support',
  ];
  const isPortalRoute = isAuthenticated && portalPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Offline Banner */}
      <OfflineBanner onOpenEmergency={() => setIsEmergencyModalOpen(true)} />

      {/* Main Header (hidden on fullscreen video calls) */}
      {!isVideoCallRoute && <Header />}

      {/* Main Content Area */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar for authenticated portal users */}
        {isPortalRoute && !isVideoCallRoute && (
          <aside className="hidden lg:block w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="sticky top-16 p-4">
              <Sidebar />
            </div>
          </aside>
        )}

        {/* Dynamic Route Pages */}
        <main
          className={`flex-1 w-full min-w-0 ${
            isVideoCallRoute
              ? 'p-0'
              : isPortalRoute
              ? 'p-4 sm:p-6 lg:p-8 max-w-6xl'
              : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'
          }`}
        >
          <Routes>
            {/* Public Marketing & Informational */}
            <Route path="/" element={<HomePage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/weather-forecast" element={<WeatherQuickExitPage />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Directory & Library */}
            <Route path="/doctors" element={<FindPsychiatristPage />} />
            <Route path="/doctors/:id" element={<DoctorProfilePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/:id" element={<ArticleDetailPage />} />

            {/* Booking & Consultation Workflows */}
            <Route
              path="/book/:doctorId"
              element={
                <ProtectedRoute>
                  <BookVisitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waiting-room/:appointmentId"
              element={
                <ProtectedRoute>
                  <WaitingRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/video-call/:appointmentId"
              element={
                <ProtectedRoute>
                  <VideoCallPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-visit/:appointmentId"
              element={
                <ProtectedRoute>
                  <PostVisitPage />
                </ProtectedRoute>
              }
            />

            {/* Protected User Portal */}
            <Route
              path="/my-day"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <DailyGoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visits"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MedicalReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-gateway"
              element={
                <ProtectedRoute>
                  <PaymentGatewayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/relapse-support"
              element={
                <ProtectedRoute>
                  <RelapseSupportPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? '/my-day' : '/'} replace />}
            />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation for Portal users */}
      {isPortalRoute && !isVideoCallRoute && <BottomNav />}

      {/* Global Footer (hidden on fullscreen video calls) */}
      {!isVideoCallRoute && <Footer />}

      {/* Always-accessible Floating Overlays */}
      {!isVideoCallRoute && (
        <>
          {/* Quick Exit Floating Button (Escape x 3 also active) */}
          <QuickExitButton variant="floating" />

          {/* Floating AI Companion Widget */}
          <FloatingChatWidget onOpenEmergency={() => setIsEmergencyModalOpen(true)} />

          {/* Hidden/Collapsible Demo Controls Drawer for reviewer testing */}
          <DemoControlsDrawer />
        </>
      )}

      {/* Global Modals */}
      <GetHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <SessionTimeoutModal />
      <CookieBanner />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <DemoProvider>
                <AppContent />
              </DemoProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}
