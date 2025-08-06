import React from 'react';
import { ReviewWithUser } from '../types';

interface ReviewCardProps {
  review: ReviewWithUser;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const initial = review.user_name ? review.user_name.charAt(0).toUpperCase() : '?';
  return (
    <div className="flex flex-col justify-between bg-white shadow rounded-lg p-6 w-80 h-48 mx-2 transition-transform duration-300 hover:scale-105">
      <div className="flex-1 text-gray-800 text-base mb-4 overflow-y-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent pr-1" style={{wordBreak: 'break-word'}}>
        {review.comment || 'No comment provided.'}
      </div>
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg mr-3">
          {initial}
        </div>
        <span className="text-gray-700 font-medium">{review.user_name}</span>
      </div>
    </div>
  );
};

export default ReviewCard; 