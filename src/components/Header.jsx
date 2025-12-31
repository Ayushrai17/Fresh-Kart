import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const isAdmin = user?.role === 'admin';
  const onAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100"
    >
      {/* Top Banner */}
      {!isAdmin && (
        <div className="bg-emerald-600 text-white text-sm py-2 text-center">
          <p className="font-medium">Super Value Deals - Save more with coupons</p>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
              FreshCart
            </span>
          </Link>

          {/* Search Bar - Desktop (hide in pure admin sections) */}
          {!isAdmin && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          )}

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              isAdmin ? (
                // Admin-only header content
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                // Normal user header content
                <>
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

          {/* Mobile Search Bar (non-admin only) */}
          {!isAdmin && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>
            </div>
          )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-100 bg-white"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            {isAuthenticated ? (
              isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
