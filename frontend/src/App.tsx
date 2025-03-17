"use client";

import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/toaster";
import { lazyLoad } from "./utils/lazyLoad";
import { SEOProvider } from "./context/SEOProvider";
import { SEOHead } from "./components/SEO/SEOHead";

// Lazy load components
const Navbar = lazyLoad(() => import("./components/Navbar"));
const Footer = lazyLoad(() => import("./components/Footer"));

// Lazy load pages
const Home = lazyLoad(() => import("./pages/Home"));
const About = lazyLoad(() => import("./pages/About"));
const Tours = lazyLoad(() => import("./pages/Tours"));
const Events = lazyLoad(() => import("./pages/Events"));
const TourDetail = lazyLoad(() => import("./pages/TourDetail"));
const FAQ = lazyLoad(() => import("./pages/footer/Faq"));
const Blogs = lazyLoad(() => import("./pages/footer/Blogs"));
const Career = lazyLoad(() => import("./pages/footer/Career"));
const Gallery = lazyLoad(() => import("./pages/footer/Gallery"));
const Team = lazyLoad(() => import("./pages/footer/Team"));
const BlogDetails = lazyLoad(() => import("./pages/footer/BlogDetails"));
const Teachings = lazyLoad(() => import("./pages/Teachings"));
const CourseDetail = lazyLoad(() => import("./pages/CourseDetail"));
const EventsDetail = lazyLoad(() => import("./pages/EventsDetails"));
const Programs = lazyLoad(() => import("./pages/Programs"));
const ProgramDetail = lazyLoad(() => import("./pages/ProgramDetail"));
const GalleryDetail = lazyLoad(() => import("./pages/footer/GallaryDetails"));
const Support = lazyLoad(() => import("./pages/Support"));
const Contact = lazyLoad(() => import("./pages/Contact"));
const Membership = lazyLoad(() => import("./pages/Membership"));
const DynamicPage = lazyLoad(() => import("./pages/DynamicPage"));

// Lazy load admin pages
const AdminLogin = lazyLoad(() => import("./pages/admin/Login"));
const AdminAbout = lazyLoad(() => import("./pages/admin/AboutUs"));
const AdminDashboard = lazyLoad(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazyLoad(() => import("./pages/admin/Users"));
const AdminPrograms = lazyLoad(() => import("./pages/admin/Programs"));
const AdminCourses = lazyLoad(() => import("./pages/admin/Courses"));
const AdminEvents = lazyLoad(() => import("./pages/admin/Events"));
const AdminTours = lazyLoad(() => import("./pages/admin/Tours"));
const AdminDonations = lazyLoad(() => import("./pages/admin/Donations"));
const AdminPages = lazyLoad(() => import("./pages/admin/Pages"));
const AdminSlider = lazyLoad(() => import("./pages/admin/Slider"));
const AdminAddSlider = lazyLoad(
  () => import("./components/admin/slider/slider")
);
const AdminSettings = lazyLoad(() => import("./pages/admin/Setting"));
const AdminFAQ = lazyLoad(() => import("./components/admin/footer/AdminFaq"));
const AdminContact = lazyLoad(() => import("./pages/admin/Contact"));
const AdminBlog = lazyLoad(() => import("./pages/admin/Blogs"));
const AdminBlogDetails = lazyLoad(
  () => import("./components/admin/footer/BlogDetails")
);
const AdminAddBlog = lazyLoad(
  () => import("./components/admin/footer/AddBlog")
);
const AdminCareer = lazyLoad(
  () => import("./components/admin/footer/AdminCareer")
);
const AdminTeam = lazyLoad(() => import("./pages/admin/Team"));
const AddTeams = lazyLoad(() => import("./pages/admin/AddTeams"));
const AdminSupport = lazyLoad(() => import("./pages/admin/Support"));
const TourForm = lazyLoad(() => import("./components/admin/tours/TourForm"));
const TourEdit = lazyLoad(() => import("./components/admin/tours/TourEdit"));
const AddNewCourse = lazyLoad(
  () => import("./components/admin/Courses/AddNewCourse")
);
const EditCourses = lazyLoad(
  () => import("./components/admin/Courses/EditCourses")
);
const EditProgramDetail = lazyLoad(
  () => import("./components/admin/program/EditProgramDetail")
);
const AddNewProgram = lazyLoad(
  () => import("./components/admin/program/AddNewProgram")
);
const EditEvent = lazyLoad(
  () => import("./components/admin/events/EditEvents")
);
const AddEvent = lazyLoad(
  () => import("./components/admin/events/AddNewEvents")
);
const AdminGallery = lazyLoad(
  () => import("./components/admin/footer/AdminGallery")
);
const AdminGalleryDetails = lazyLoad(
  () => import("./components/admin/footer/AdminGalleryDetails")
);
const Bookings = lazyLoad(() => import("./pages/admin/Bookings"));
const Enrollments = lazyLoad(() => import("./pages/admin/Enrollments"));
const EventBookings = lazyLoad(() => import("./pages/admin/EventBookings"));
const ProgramBooking = lazyLoad(() => import("./pages/admin/ProgramBooking"));
const Newsletters = lazyLoad(() => import("./pages/admin/Newsletters"));
const Enquiries = lazyLoad(() => import("./pages/admin/Enquiries"));
const Testimonials = lazyLoad(() => import("./pages/admin/Testimonial"));
const Stats = lazyLoad(() => import("./pages/admin/Stats"));
const MembershipManagement = lazyLoad(() => import("./pages/admin/Membership"));
const PageForm = lazyLoad(() => import("./components/admin/pages/PageForm"));
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;

    try {
      const decoded: { exp: number } = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken"); // Remove expired token
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  React.useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate("/admin", { state: { from: location }, replace: true });
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate, location]);

  const isAuth = isAuthenticated();
  const isAdminRoute = location.pathname === "/admin";

  // If the user is NOT authenticated and trying to access anything other than "/admin", redirect to "/admin"
  if (!isAuth && !isAdminRoute) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <SEOProvider>
          <SEOHead />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/about"
                element={
                  <ProtectedRoute>
                    <AdminAbout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/Programs"
                element={
                  <ProtectedRoute>
                    <AdminPrograms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/program-booking"
                element={
                  <ProtectedRoute>
                    <ProgramBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contact"
                element={
                  <ProtectedRoute>
                    <AdminContact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/programs/add-new-program"
                element={
                  <ProtectedRoute>
                    <AddNewProgram />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/programs/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditProgramDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <AdminEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/event-bookings"
                element={
                  <ProtectedRoute>
                    <EventBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/add-new-event"
                element={
                  <ProtectedRoute>
                    <AddEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/slider"
                element={
                  <ProtectedRoute>
                    <AdminSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sliders/add"
                element={
                  <ProtectedRoute>
                    <AdminAddSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sliders/add/:id"
                element={
                  <ProtectedRoute>
                    <AdminAddSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/add-new-course"
                element={
                  <ProtectedRoute>
                    <AddNewCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <ProtectedRoute>
                    <Enrollments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tours"
                element={
                  <ProtectedRoute>
                    <AdminTours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tours/add-new-page"
                element={
                  <ProtectedRoute>
                    <TourForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tours/edit/:id"
                element={
                  <ProtectedRoute>
                    <TourEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donations"
                element={
                  <ProtectedRoute>
                    <AdminDonations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pages"
                element={
                  <ProtectedRoute>
                    <AdminPages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pages/new"
                element={
                  <ProtectedRoute>
                    <PageForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pages/new/:slug"
                element={
                  <ProtectedRoute>
                    <PageForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/support-us"
                element={
                  <ProtectedRoute>
                    <AdminSupport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/faq"
                element={
                  <ProtectedRoute>
                    <AdminFAQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/membership"
                element={
                  <ProtectedRoute>
                    <MembershipManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs"
                element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/edit/:id"
                element={
                  <ProtectedRoute>
                    <AdminBlogDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/add-new-blog"
                element={
                  <ProtectedRoute>
                    <AdminAddBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team"
                element={
                  <ProtectedRoute>
                    <AdminTeam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-team"
                element={
                  <ProtectedRoute>
                    <AddTeams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-team/:id"
                element={
                  <ProtectedRoute>
                    <AddTeams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/career"
                element={
                  <ProtectedRoute>
                    <AdminCareer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enquiries"
                element={
                  <ProtectedRoute>
                    <Enquiries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <Testimonials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute>
                    <AdminGallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/newsletters"
                element={
                  <ProtectedRoute>
                    <Newsletters />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gallery/:categoryId/event/:eventId"
                element={
                  <ProtectedRoute>
                    <AdminGalleryDetails />
                  </ProtectedRoute>
                }
              />
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/tours" element={<Tours />} />
                        <Route path="/tours/:id" element={<TourDetail />} />
                        <Route path="/teachings" element={<Teachings />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route path="/:slug" element={<DynamicPage />} />
                        <Route path="/membership" element={<Membership />} />

                        <Route
                          path="/teachings/:courseId"
                          element={<CourseDetail />}
                        />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventsDetail />} />
                        <Route
                          path="/programs/:id"
                          element={<ProgramDetail />}
                        />
                        <Route path="/support" element={<Support />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/career" element={<Career />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route
                          path="/gallery/:categoryId/event/:_id"
                          element={<GalleryDetail />}
                        />
                        <Route path="/team" element={<Team />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog/:id" element={<BlogDetails />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </Suspense>
          <Toaster />
        </SEOProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
