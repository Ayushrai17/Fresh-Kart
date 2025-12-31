import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Plus } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100">
          <motion.img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            whileHover={{ scale: 1.1 }}
          />
          {product.subscriptionEligible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg"
            >
              Subscribe Available
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          {/* Rating & Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500 ml-1">(4)</span>
            </div>
            <span className="text-xl font-bold text-emerald-600">₹{product.price}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.button>
            {product.subscriptionEligible && (
              <Link
                to={`/products/${product._id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-2 border border-emerald-200"
              >
                <Plus className="w-4 h-4" />
                <span>Subscribe</span>
              </Link>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
