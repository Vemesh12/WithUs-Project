import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const MyOrders: React.FC = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
    if (user) {
      console.log('Fetching orders for user.id:', user.id); // Debug log
      setFetching(true);
      ordersAPI.getByUserId(user.id)
        .then(setOrders)
        .catch(() => setError('Failed to fetch orders.'))
        .finally(() => setFetching(false));
    }
  }, [user, loading, navigate]);

  if (loading || fetching) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">You have not placed any orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-gray-600 text-sm">Status: <span className={`font-bold ${order.status === 'cancelled' ? 'text-red-600' : order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></div>
              </div>
              <div className="mt-2 md:mt-0">
                <Link to={`/order/${order.id}`} className="btn-primary text-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders; 