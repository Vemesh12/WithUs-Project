import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemWithReviews } from '../types';
import { itemsAPI, reviewsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState<ItemWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    serviceType: 'delivery' as 'delivery' | 'in_person',
    quantity: 1,
    deliveryAddress: '',
    scheduledTime: '',
    mobileNumber: '' // New field
  });
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const itemData = await itemsAPI.getById(parseInt(id));
        setItem(itemData);
      } catch (err) {
        setError('Failed to load item details. Please try again.');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!item) return;

    try {
      const orderData = {
        item_id: item.id,
        service_type: orderForm.serviceType,
        quantity: orderForm.quantity,
        delivery_address: orderForm.serviceType === 'delivery' ? orderForm.deliveryAddress : undefined,
        scheduled_time: orderForm.serviceType === 'in_person' ? orderForm.scheduledTime : undefined,
        mobile_number: orderForm.mobileNumber // New field
      };

      await ordersAPI.create(orderData);
      setShowOrderModal(false);
      navigate('/my-orders');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order. Please try again.');
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!item) return;

    try {
      const reviewData = {
        item_id: item.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };

      await reviewsAPI.create(reviewData);
      setShowReviewModal(false);
      
      // Refresh item data to show new review
      const updatedItem = await itemsAPI.getById(parseInt(id!));
      setItem(updatedItem);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <button
            onClick={() => navigate('/items')}
            className="btn-primary"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Item Image */}
          <div>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">No Image</span>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {item.category}
                </span>
                <span
                  className={`text-sm font-medium ${
                    item.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-4">
                ₹{item.price}
              </div>
              {item.description && (
                <p className="text-gray-600 text-lg">{item.description}</p>
              )}
            </div>

            {/* Average Rating */}
            {item.average_rating && (
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(Math.round(item.average_rating))}
                </div>
                <span className="text-gray-600">
                  {item.average_rating.toFixed(1)} ({item.review_count} reviews)
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowOrderModal(true)}
                className="btn-primary flex-1"
                disabled={item.stock_quantity === 0}
              >
                {item.stock_quantity === 0 ? 'Out of Stock' : 'Order Now'}
              </button>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-secondary"
              >
                Write Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {item.reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this item!</p>
          ) : (
            <div className="space-y-6">
              {item.reviews.map((review) => (
                <div key={review.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Place Order</h3>
              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={orderForm.serviceType}
                    onChange={(e) => setOrderForm({...orderForm, serviceType: e.target.value as 'delivery' | 'in_person'})}
                    className="input-field"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="in_person">In-Person Service</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={item.stock_quantity}
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                
                {orderForm.serviceType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={orderForm.deliveryAddress}
                      onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                      className="input-field"
                      rows={3}
                      required
                    />
                  </div>
                )}
                
                {orderForm.serviceType === 'in_person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time
                    </label>
                    <input
                      type="datetime-local"
                      value={orderForm.scheduledTime}
                      onChange={(e) => setOrderForm({...orderForm, scheduledTime: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={orderForm.mobileNumber}
                    onChange={(e) => setOrderForm({...orderForm, mobileNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="input-field"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail; 