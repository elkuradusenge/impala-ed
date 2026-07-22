import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset link has been sent to your email.');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (_) {
      setError('Unable to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card-white max-w-md w-full">
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faKey} className="text-impala-brown text-4xl mb-2" />
          <h2 className="text-2xl font-bold font-display text-impala-charcoal">Forgot Password</h2>
          <p className="text-impala-charcoal-muted">Enter your email to receive a reset link</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        {message && <div className="bg-impala-green/10 text-impala-green p-3 rounded-lg mb-4 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Email Address</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" required placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-impala-charcoal-muted">
          <Link to="/login" className="text-impala-brown hover:text-impala-brown-dark font-medium inline-flex items-center space-x-1">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
