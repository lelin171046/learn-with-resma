import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorPage from './pages/ErrorPage';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const IELTSProgram = lazy(() => import('./pages/IELTSProgram'));
const SpeakingProgram = lazy(() => import('./pages/SpeakingProgram'));
const WritingProgram = lazy(() => import('./pages/WritingProgram'));
const ListeningProgram = lazy(() => import('./pages/ListeningProgram'));
const Pronunciation = lazy(() => import('./pages/Pronunciation'));
const PracticeMCQ = lazy(() => import('./pages/PracticeMCQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SuccessStories = lazy(() => import('./pages/SuccessStories'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));

const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const MyCourses = lazy(() => import('./pages/dashboard/MyCourses'));
const ContinueLearning = lazy(() => import('./pages/dashboard/ContinueLearning'));
const CompletedCourses = lazy(() => import('./pages/dashboard/CompletedCourses'));
const DashboardAssignments = lazy(() => import('./pages/dashboard/DashboardAssignments'));
const DashboardCertificates = lazy(() => import('./pages/dashboard/DashboardCertificates'));
const QuizResults = lazy(() => import('./pages/dashboard/QuizResults'));
const WatchHistory = lazy(() => import('./pages/dashboard/WatchHistory'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const Wishlist = lazy(() => import('./pages/dashboard/Wishlist'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses'));
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'));
const ManageLessons = lazy(() => import('./pages/admin/ManageLessons'));
const ManageLiveClasses = lazy(() => import('./pages/admin/ManageLiveClasses'));
const ManageAssignments = lazy(() => import('./pages/admin/ManageAssignments'));
const ManageQuizzes = lazy(() => import('./pages/admin/ManageQuizzes'));
const ManageCertificates = lazy(() => import('./pages/admin/ManageCertificates'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'));
const ManageComments = lazy(() => import('./pages/admin/ManageComments'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const WebsiteSettings = lazy(() => import('./pages/admin/WebsiteSettings'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route element={<PublicLayout />} errorElement={<ErrorPage />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:slug" element={<CourseDetails />} />
          <Route path="/ielts-program" element={<IELTSProgram />} />
          <Route path="/english-speaking" element={<SpeakingProgram />} />
          <Route path="/writing-program" element={<WritingProgram />} />
          <Route path="/listening-program" element={<ListeningProgram />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/practice-mcq" element={<PracticeMCQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute />} errorElement={<ErrorPage />}>
          <Route path="/course/:slug/learn" element={<CoursePlayer />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="continue-learning" element={<ContinueLearning />} />
            <Route path="completed-courses" element={<CompletedCourses />} />
            <Route path="assignments" element={<DashboardAssignments />} />
            <Route path="certificates" element={<DashboardCertificates />} />
            <Route path="quiz-results" element={<QuizResults />} />
            <Route path="watch-history" element={<WatchHistory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />} errorElement={<ErrorPage />}>
          <Route path="/admin" element={<DashboardLayout isAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="lessons" element={<ManageLessons />} />
            <Route path="live-classes" element={<ManageLiveClasses />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="quizzes" element={<ManageQuizzes />} />
            <Route path="certificates" element={<ManageCertificates />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="comments" element={<ManageComments />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="settings" element={<WebsiteSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
