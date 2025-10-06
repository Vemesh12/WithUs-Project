import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { itemsAPI } from '../services/api';
// import ItemCard from '../components/ItemCard';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Package, ShieldCheck, Users  } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refs for scroll animations
  const featuredRef = useRef(null);
  const reviewsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // InView hooks for scroll animations
  const featuredInView = useInView(featuredRef, { once: false, margin: "-100px" });
  const reviewsInView = useInView(reviewsRef, { once: false, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: false, margin: "-100px" });

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const items = await itemsAPI.getAll();
        // Only take first 5
        setFeaturedItems(items.slice(0, 5));
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-black text-white min-h-screen flex items-center -mt-20 ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center">
    <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
      <h1 className="text-[16px] md:text-[28px] font-bold mb-4">
      Farm to Door by <span className="text-[#e9ff09]">WithVemesh.</span>
      </h1>
      <h1 className="text-4xl text-[#e9ff09] md:text-6xl font-bold mb-6">Not Just Another Grocery Delivery Service!</h1>
      <p className="text-xl md:text-2xl text-[#898989] mb-12">
        delivering farm-fresh fruits, vegetables, dairy, and beverages right to your doorstep — fast, fresh, and hassle-free.
      </p>
      </motion.div>
      <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-x-4"
          >
      <div className="md:space-x-4 md:flex-row md:flex items-center md:items-center md:justify-center md:space-y-0 space-y-6 flex flex-col">
        <Link
          to="/items"
          className="bg-[#e9ff09] text-black px-8 py-4 rounded-lg font-bold text-[24px] transition-colors duration-200"
        >
          Browse Items
        </Link>
        <Link
          to="/register"
          className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-bold text-[24px] transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
      </motion.div>
    </div>
  </div>
</section>


      {/* Featured Items Section */}
      <section ref={featuredRef} className="py-16 bg-black min-h-screen flex items-center overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div className="text-center mb-12">
    <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={featuredInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
      <h2 className="text-3xl md:text-6xl font-bold text-[#e9ff09] mb-4">
        Featured Items
      </h2>
      <p className="text-lg text-white">
        Discover our most popular fresh items
      </p>
      </motion.div>
    </div>
  

    {loading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    ) : (
      <>
        {/* Desktop → Infinite Auto Scroll */}
        <div className="hidden lg:block relative overflow-hidden w-full">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
          <motion.div
            className="flex space-x-8"
            animate={featuredInView ? { x: ["0%", "-100%"] } : { x: "0%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {[...featuredItems, ...featuredItems].map((item, index) => (
              <div
                key={index}
                className="min-w-[30%] max-w-[400px] bg-white shadow-lg rounded-xl p-6 flex flex-col items-center"
              >
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="h-60 w-60 object-cover rounded-lg mb-6"
                />
                <h3 className="font-semibold text-xl text-black">
                  {item.name}
                </h3>
                {/* <p className="text-md text-gray-600 mt-2">
                  ₹{item.price?.toFixed(2)}
                </p> */}
              </div>
            ))}
          </motion.div>
          </motion.div>
        </div>
        

        {/* Mobile → Swiper with dots */}
        <div className="block lg:hidden relative">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
  <Swiper
    modules={[Pagination]}
    spaceBetween={16}
    slidesPerView={1}
    pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
  >
    {featuredItems.map((item, index) => (
      <SwiperSlide key={index}>
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center mx-auto max-w-sm">
          <img
            src={item.image_url || "/placeholder.png"}
            alt={item.name}
            className="h-48 w-48 object-cover rounded-lg mb-6"
          />
          <h3 className="font-semibold text-xl text-gray-800 text-center">
            {item.name}
          </h3>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* External Pagination Dots */}
  <div className="swiper-pagination-custom flex justify-center mt-4"></div>
  </motion.div>
</div>


      </>
    )}

    <div className="text-center mt-12">
    <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="space-x-4"
          >
      <Link
        to="/items"
        className="bg-[#e9ff09] text-black font-bold px-8 py-4 rounded-lg text-[24px] transition-colors duration-200"
      >
        View All Items
      </Link>
      </motion.div>
    </div>
  </div>
</section>



      {/* Reviews Carousel Section */}
      <section ref={reviewsRef} className="py-20 bg-black overflow-hidden">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold md:text-5xl text-white mb-8 text-center">What Our <span className='text-[#e9ff09]'>Users </span>Say</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <ReviewsCarousel />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-withus" ref={featuresRef} className="bg-black py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Choose <span className='text-[#e9ff09]'>WithUs?</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package/>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Fast Delivery
              </h3>
              <p className="text-[#898989]">
                Get your items delivered quickly and safely to your doorstep
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 100 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
               <ShieldCheck />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Quality Assured
              </h3>
              <p className="text-[#898989]">
                All our items are carefully selected and quality tested
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users/>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                In-Person Service
              </h3>
              <p className="text-[#898989]">
                Schedule in-person services for a personalized experience
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 