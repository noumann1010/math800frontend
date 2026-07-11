import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { ToastViewport } from './components/ToastViewport';
import { AppProvider } from './context/AppContext';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogPage } from './pages/BlogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CoursesPage } from './pages/CoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { LessonWorkspacePage } from './pages/LessonWorkspacePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PricingPage } from './pages/PricingPage';
import { PracticePage } from './pages/PracticePage';
import { FullTestPage } from './pages/FullTestPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.22 }}
      >
        <Routes location={location}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/full-test" element={<FullTestPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/lesson/:lessonId" element={<LessonWorkspacePage />} />
          <Route path="/lesson" element={<Navigate to="/lesson/lesson-1" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <ToastViewport />
        <AnimatedRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
