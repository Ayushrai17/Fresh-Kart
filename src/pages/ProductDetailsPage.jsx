import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productService } from '../services/productService';
import { addItemToCart } from '../redux/slices/cartSlice';
import SubscriptionModal from '../components/SubscriptionModal';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Star, ChevronDown, ChevronUp, Package, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('description');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProduct(id);
      setProduct(data);
      
      // Fetch related products (same category)
      if (data.category) {
        const related = await productService.getProducts({ category: data.category });
        setRelatedProducts(related.filter(p => p._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({ productId: product._id, quantity }));
    alert('Added to cart!');
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const accordionSections = [
    {
      id: 'description',
      title: 'Description',
      content: product?.description || 'No description available.',
    },
    {
      id: 'storage',
      title: 'Storage Instructions',
      content: 'Store in a cool, dry place. Keep away from direct sunlight. Refrigerate after opening if required.',
    },
    {
      id: 'delivery',
      title: 'Delivery Information',
      content: 'Free delivery on orders above $50. Standard delivery takes 2-3 business days. Express delivery available.',
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-gray-600"
        >
          <Link to="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-emerald-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.image || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex space-x-2">
              {[product.image].map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-emerald-600'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img || 'https://via.placeholder.com/100'}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4 reviews)</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600 mb-6">
                ₹{product.price}
              </p>
            </div>

            {product.subscriptionEligible && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-semibold">
                    Subscription Available
                  </span>
                </div>
              </motion.div>
            )}

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
                {product.subscriptionEligible && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSubscriptionModal(true)}
                    className="flex-1 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    Subscribe
                  </motion.button>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">SKU: </span>
                <span className="font-medium">{product._id.slice(-8)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Category: </span>
                <span className="font-medium">{product.category}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Accordion Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-12"
        >
          {accordionSections.map((section) => (
            <div key={section.id} className="border-b border-gray-200 last:border-0">
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === section.id ? '' : section.id)
                }
                className="w-full flex items-center justify-between py-4 text-left hover:text-emerald-600 transition-colors"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {openAccordion === section.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <AnimatePresence>
                {openAccordion === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        <SubscriptionModal
          product={product}
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
