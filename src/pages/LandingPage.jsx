import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Clock,
  Gift,
  Package,
  RotateCcw,
  Apple,
  Wheat,
  Coffee,
  Drumstick,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* 🔥 LOCAL IMAGES */
import heroVeggies from "../image/hero-veggies.png";
import personalCareImg from "../image/blue body care.png";
import freshBagImg from "../image/fresh-bag.png";
import iceCreamImg from "../image/ice-cream.png";

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const categories = [
    { icon: Wheat, label: "Dairy, Bread & Eggs", color: "bg-blue-100 text-blue-600" },
    { icon: Apple, label: "Fruits & Vegetables", color: "bg-green-100 text-green-600" },
    { icon: Package, label: "Snacks & Munchies", color: "bg-yellow-100 text-yellow-600" },
    { icon: Coffee, label: "Bakery & Biscuits", color: "bg-orange-100 text-orange-600" },
    { icon: Package, label: "Cold Drinks & Juices", color: "bg-cyan-100 text-cyan-600" },
    { icon: Drumstick, label: "Chicken, Meat & Fish", color: "bg-red-100 text-red-600" },
    { icon: Heart, label: "Baby Care", color: "bg-pink-100 text-pink-600" },
    { icon: Sparkles, label: "Cleaning Essentials", color: "bg-purple-100 text-purple-600" },
  ]; 

  const features = [
    {
      icon: Clock,
      title: "10 minute grocery now",
      description: "Get your order delivered to your doorstep at the earliest.",
      color: "text-blue-600",
    },
    {
      icon: Gift,
      title: "Best Prices & Offers",
      description: "Cheaper prices than your local supermarket.",
      color: "text-emerald-600",
    },
    {
      icon: Package,
      title: "Wide Assortment",
      description: "5000+ products across all grocery categories.",
      color: "text-purple-600",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Doorstep returns with instant refunds.",
      color: "text-orange-600",
    },
  ];

  const promoBanners = [
    {
      title: "10% cashback on personal care",
      subtitle: "Max cashback: ₹120",
      code: "Code: CARE120",
      bg: "bg-blue-50",
      img: personalCareImg,
    },
    {
      title: "Say yes to season's fresh",
      subtitle: "Refresh your day the fruity way",
      bg: "bg-yellow-50",
      img: freshBagImg,
    },
    {
      title: "When in doubt, eat ice cream",
      subtitle: "Enjoy a scoop of summer today",
      bg: "bg-pink-50",
      img: iceCreamImg,
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-br text-emerald-600 via-white to-emerald-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-100 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Exclusive Offer 10%
              </span>

              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                SuperMarket For <br />
                <span className="text-emerald-600">Fresh Grocery</span>
              </h1>

              <p className="text-gray-600 text-lg mb-8">
                Introduced a new model for online grocery shopping and convenient home delivery.
              </p>

              <div className="flex gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="bg-emerald-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2"
                    >
                      Get Started <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/products"
                      className="border-2 border-emerald-600 text-emerald-600 px-7 py-3 rounded-lg font-semibold"
                    >
                      Browse Products
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/products"
                    className="bg-emerald-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2"
                  >
                    Shop Now <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </motion.div>

            {/* RIGHT IMAGE (PIXEL PERFECT CURVE) */}
            <motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="flex justify-center"
>
  <img
    src={heroVeggies}
    alt="Fresh Grocery"
    className="max-w-full h-auto object-contain"
  />
</motion.div>


          </div>
        </div>
      </section>

      {/* ================= PROMO BANNERS ================= */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {promoBanners.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${b.bg} relative overflow-hidden rounded-2xl p-6 shadow`}
              >
                <div className="relative z-10 max-w-[65%]">
                  <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{b.subtitle}</p>
                  {b.code && <p className="text-sm font-medium mb-3">{b.code}</p>}
                  <Link
                    to="/products"
                    className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm inline-block"
                  >
                    Shop Now
                  </Link>
                </div>

                <img
                  src={b.img}
                  alt=""
                  className="absolute right-0 bottom-0 h-full w-[45%] object-contain"
                  style={{
                    clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Shop Popular Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition"
                >
                  <div
                    className={`${c.color} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}
                  >
                    <Icon size={28} />
                  </div>
                  <p className="font-semibold text-sm">{c.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FreshCart?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow">
                  <div className={`${f.color} mb-4`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
