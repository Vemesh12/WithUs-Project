// ReviewsCarousel.tsx
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ReviewWithUser } from '../types';
import { reviewsAPI } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewCardProps {
  review: ReviewWithUser;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const initial = review.user_name ? review.user_name.charAt(0).toUpperCase() : '?';
  return (
    <div className="flex flex-col justify-between bg-gray-500 shadow-lg rounded-lg p-6  w-96 h-60 mx-auto">
      <div
        className="flex-1 text-white text-base mb-4 overflow-y-hidden"
        style={{ wordBreak: 'break-word' }}
      >
        {review.comment || 'No comment provided.'}
      </div>
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full bg-[#e9ff09] flex items-center justify-center text-black font-bold text-lg mr-3">
          {initial}
        </div>
        <span className="text-white font-medium">{review.user_name}</span>
      </div>
    </div>
  );
};

const ReviewsCarousel: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsAPI.getAll().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="flex justify-center items-center h-48">No reviews yet.</div>;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons - Responsive design for all screen sizes */}
      <button className="swiper-button-prev-custom absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-[#e9ff09] text-black rounded-full p-2 md:p-3 hover:bg-yellow-300 transition-colors duration-200 shadow-lg flex items-center justify-center">
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>
      
      <button className="swiper-button-next-custom absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-[#e9ff09] text-black rounded-full p-2 md:p-3 hover:bg-yellow-300 transition-colors duration-200 shadow-lg flex items-center justify-center">
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 }, // 2 cards on tablet
          768: { slidesPerView: 3 }, // 3 cards on desktop
        }}
        centeredSlides={true}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        className="pb-12 px-12 md:px-12" // Responsive padding for navigation buttons
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            {({ isActive }) => (
              <div
                className={`transition-opacity duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90'
                }`}
              >
                <ReviewCard review={review} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom dots */}
      <div className="swiper-pagination-custom flex justify-center mt-10"></div>
    </div>
  );
};

export default ReviewsCarousel;
