import React, { useEffect, useRef, useState } from 'react';
import { ReviewWithUser } from '../types';
import { reviewsAPI } from '../services/api';
import ReviewCard from './ReviewCard';

interface ReviewsCarouselProps {
  className?: string;
  style?: React.CSSProperties;
}

const CARD_WIDTH = 320; // px, matches w-80 in Tailwind
const CARD_GAP = 16; // px, matches mx-2 in Tailwind
const VISIBLE_CARDS = 3; // Number of cards visible at once (adjust as needed)

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ className = '', style }) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reviewsAPI.getAll().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  // Smooth infinite scroll logic
  useEffect(() => {
    if (paused || !scrollRef.current || reviews.length === 0) return;
    const scrollContainer = scrollRef.current;
    let animationFrame: number;
    let lastTimestamp = performance.now();
    const speed = 0.5; // px per ms
    // Duplicate reviews for seamless looping
    //const totalCards = reviews.length * 2;
    //const totalWidth = totalCards * (CARD_WIDTH + CARD_GAP);

    function step(timestamp: number) {
      if (paused) return;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      scrollContainer.scrollLeft += speed * elapsed;
      // Loop smoothly
      if (scrollContainer.scrollLeft >= (reviews.length * (CARD_WIDTH + CARD_GAP))) {
        scrollContainer.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(step);
    }
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [paused, reviews]);

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading reviews...</div>;
  }
  if (reviews.length === 0) {
    return <div className="flex justify-center items-center h-48">No reviews yet.</div>;
  }

  // Duplicate reviews for seamless looping
  const displayReviews = [...reviews, ...reviews];

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ ...style, cursor: paused ? 'pointer' : 'grab', maxWidth: `${VISIBLE_CARDS * (CARD_WIDTH + CARD_GAP)}px`, margin: '0 auto' }}
      ref={scrollRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex" style={{ width: `${displayReviews.length * (CARD_WIDTH + CARD_GAP)}px` }}>
        {displayReviews.map((review, idx) => (
          <ReviewCard key={idx + '-' + review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsCarousel; 