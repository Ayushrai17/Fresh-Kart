import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/userSlice';
import { fetchCart } from './redux/slices/cartSlice';
import { useSocket } from './hooks/useSocket';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './utils/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.user);
  const location = useLocation();

  // Initialize socket connection if authenticated
  useSocket();

  useEffect(() => {
    // Fetch current user if token exists
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Fetch cart if authenticated
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
