import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Youtube, Smartphone, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const categories = [
    'Vegetables & Fruits',
    'Breakfast & Instant food',
    'Bakery & Biscuits',
    'Atta, Rice & Dal',
    'Sauces & spreads',
    'Organic & gourmet',
    'Baby care',
    'Cleaning essentials',
    'Personal care',
    'Dairy, bread & eggs',
    'Cold drinks & juices',
    'Tea, coffee & drinks',
    'Masala, oil & more',
    'Chicken, meat & fish',
    'Pet care',
    'Pharma & wellness',
    'Home & office',
  ];

  const footerLinks = {
    'Get to know us': [
      { label: 'Company', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Our Value', href: '#' },
    ],
    'For Consumers': [
      { label: 'Payments', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Product Returns', href: '#' },
      { label: 'Shop Checkout', href: '#' },
    ],
    'Become a Shopper': [
      { label: 'Shopper Opportunities', href: '#' },
      { label: 'Become a Shopper', href: '#' },
      { label: 'Earnings', href: '#' },
      { label: 'Ideas & Guides', href: '#' },
      { label: 'New Retailers', href: '#' },
    ],
    'Freshcart programs': [
      { label: 'Freshcart programs', href: '#' },
      { label: 'Gift Cards', href: '#' },
      { label: 'Promos & Coupons', href: '#' },
      { label: 'Freshcart Ads', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Categories Column */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 8).map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/products"
                    className="text-gray-600 hover:text-emerald-600 text-sm transition-colors"
                  >
                    {category}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Footer Links Columns */}
          {Object.entries(footerLinks).map(([title, links], colIndex) => (
            <div key={title}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-emerald-600 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">support@freshcart.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900 font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Download App</p>
                <p className="text-gray-900 font-medium">Get it on App Store & Google Play</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Partners */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Payment Partners</p>
          <div className="flex flex-wrap items-center gap-4">
            {['Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay'].map(
              (method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"
                >
                  {method}
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Follow us on</span>
              <div className="flex space-x-3">
                {[
                  { Icon: Facebook, href: '#' },
                  { Icon: Instagram, href: '#' },
                  { Icon: Twitter, href: '#' },
                  { Icon: Youtube, href: '#' },
                ].map(({ Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center md:text-right">
              Copyright 2025 @freshcart. All rights reserved. Powered by freshcart.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
