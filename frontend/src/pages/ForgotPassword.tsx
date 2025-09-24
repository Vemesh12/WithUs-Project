import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.requestPasswordReset(email);
      setStatus(res.message || 'If the email exists, a reset link has been sent.');
    } catch (err: any) {
      setStatus('If the email exists, a reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your email and we'll send you a reset link.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1 w-full"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {status && <div className="text-green-600 text-sm">{status}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3 text-lg"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;


