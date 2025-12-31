import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, LayoutGrid, List } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Products', backendCategory: '' },
  { id: 'dairy', label: 'Dairy, Bread & Eggs', backendCategory: 'Dairy, Bread & Eggs' },
  { id: 'snacks', label: 'Snacks & Munchies', backendCategory: 'Snacks & Munchies' },
  { id: 'fruits', label: 'Fruits & Vegetables', backendCategory: 'Fruits & Vegetables' },
  { id: 'drinks', label: 'Cold Drinks & Juices', backendCategory: 'Cold Drinks & Juices' },
  { id: 'bakery', label: 'Bakery & Biscuits', backendCategory: 'Bakery & Biscuits' },
  { id: 'personal', label: 'Personal Care', backendCategory: 'Personal Care' },
  { id: 'household', label: 'Household Essentials', backendCategory: 'Household Essentials' },
];

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: '',
  });
  const [activeCategoryId, setActiveCategoryId] = useState('dairy');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price' | 'rating'

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts(filters);
      setProducts(data);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategoryId(categoryId);
    const config = CATEGORIES.find((c) => c.id === categoryId);
    const backendCategory = config?.backendCategory || '';
    setFilters((prev) => ({
      ...prev,
      category: backendCategory,
    }));
    setSidebarOpen(false);
  };

  const selectedCategoryLabel = useMemo(() => {
    return CATEGORIES.find((c) => c.id === activeCategoryId)?.label || 'All Products';
  }, [activeCategoryId]);

  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (sortBy === 'price') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [products, sortBy]);

  const displayedProducts = useMemo(
    () => sortedProducts.slice(0, pageSize),
    [sortedProducts, pageSize]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">{products.length} products available</p>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-md p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-1">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const isActive = activeCategoryId === cat.id;
                  const Icon = isActive ? ChevronDown : ChevronRight;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Categories Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md text-gray-700 hover:bg-gray-50"
              >
                <span className="text-sm font-medium">Categories</span>
                {sidebarOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {sidebarOpen && (
                <div className="mt-3 bg-white rounded-2xl shadow-md p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
                  <div className="space-y-1">
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                      const isActive = activeCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Toolbar above products */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategoryLabel}
                </h2>
                <p className="text-xs text-gray-500">
                  {products.length} products found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                {/* View toggle */}
                <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 flex items-center gap-1 text-xs ${
                      viewMode === 'grid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 flex items-center gap-1 text-xs ${
                      viewMode === 'list'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </button>
                </div>

                {/* Show count */}
                <div className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="text-gray-600">Show:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-transparent text-gray-800 focus:outline-none"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Sort by */}
                <div className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-gray-800 focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid (always attempt to render; seed ensures data exists) */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-md p-4 flex gap-4"
                  >
                    <div className="w-32 flex-shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
