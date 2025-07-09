import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';

const AdminOrders: React.FC = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setFetching(true);
      ordersAPI.getAll()
        .then(setOrders)
        .catch(() => setError('Failed to fetch orders.'))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleAccept = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      await ordersAPI.updateStatus(orderId, 'confirmed');
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: 'confirmed', cancellation_reason: undefined } : o));
    } catch {
      setError('Failed to accept order.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!cancelReason) return;
    setActionLoading(orderId);
    try {
      await ordersAPI.updateStatus(orderId, 'cancelled', cancelReason);
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: 'cancelled', cancellation_reason: cancelReason } : o));
      setShowCancelPrompt(null);
      setCancelReason('');
    } catch {
      setError('Failed to cancel order.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || fetching) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-12">Not authorized.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Orders Dashboard</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold">Order #{order.id}</div>
                  <div className="text-gray-600 text-sm">User ID: {order.user_id}</div>
                  <div className="text-gray-600 text-sm">Item ID: {order.item_id}</div>
                  <div className="text-gray-600 text-sm">Status: <span className={`font-bold ${order.status === 'cancelled' ? 'text-red-600' : order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></div>
                  {order.status === 'cancelled' && order.cancellation_reason && (
                    <div className="text-red-600 text-sm mt-1">Reason: {order.cancellation_reason}</div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col gap-2 md:gap-0 md:flex-row md:items-center">
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn-primary md:mr-2 mb-2 md:mb-0"
                        disabled={actionLoading === order.id}
                        onClick={() => handleAccept(order.id)}
                      >
                        {actionLoading === order.id ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        className="btn-secondary"
                        disabled={actionLoading === order.id}
                        onClick={() => setShowCancelPrompt(order.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              {showCancelPrompt === order.id && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="input-field w-full mb-2"
                    placeholder="Enter cancellation reason"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => setShowCancelPrompt(null)}>Close</button>
                    <button className="btn-secondary" disabled={!cancelReason || actionLoading === order.id} onClick={() => handleCancel(order.id)}>
                      {actionLoading === order.id ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 