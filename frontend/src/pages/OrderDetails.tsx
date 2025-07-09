import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { Order } from '../types';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ordersAPI.getById(Number(id))
      .then(setOrder)
      .catch(() => setError('Failed to fetch order details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>
      <div className="card space-y-4">
        <div><span className="font-semibold">Status:</span> <span className={`font-bold ${order.status === 'cancelled' ? 'text-red-600' : order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></div>
        <div><span className="font-semibold">Item ID:</span> {order.item_id}</div>
        <div><span className="font-semibold">Quantity:</span> {order.quantity}</div>
        <div><span className="font-semibold">Service Type:</span> {order.service_type}</div>
        <div><span className="font-semibold">Mobile Number:</span> {order.mobile_number}</div>
        <div><span className="font-semibold">Delivery Address:</span> {order.delivery_address || '-'}</div>
        <div><span className="font-semibold">Scheduled Time:</span> {order.scheduled_time ? new Date(order.scheduled_time).toLocaleString() : '-'}</div>
        <div><span className="font-semibold">Total Price:</span> ₹{order.total_price}</div>
        {order.status === 'cancelled' && order.cancellation_reason && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <span className="font-semibold">Cancellation Reason:</span> {order.cancellation_reason}
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => navigate('/my-orders')} className="btn-secondary">Back to My Orders</button>
      </div>
    </div>
  );
};

export default OrderDetails; 