import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faBookOpen,
  faSpinner,
  faUserGraduate,
  faChalkboardTeacher,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

type LoginRole = 'student' | 'mentor';

const TABS: { role: LoginRole; label: string; icon: any }[] = [
  { role: 'student', label: 'Student', icon: faUserGraduate },
  { role: 'mentor', label: 'Teacher', icon: faChalkboardTeacher },
];

const LoginPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users away from login page
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [activeTab, setActiveTab] = useState<LoginRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const isStudent = activeTab === 'student';
  const roleLabel = isStudent ? 'Student' : 'Teacher';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    try {
      const data = await login(email, password);
      const routes: Record<string, string> = {
        student: '/student/dashboard',
        mentor: '/mentor/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(routes[data.role] || '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-impala-brown/10 text-impala-brown mb-4">
            <FontAwesomeIcon icon={faBookOpen} className="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold font-display text-impala-charcoal">Welcome Back</h1>
          <p className="text-impala-charcoal-muted mt-1">
            Sign in to your ImpalaEd account
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.role;
            return (
              <button
                key={tab.role}
                type="button"
                onClick={() => {
                  setActiveTab(tab.role);
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? tab.role === 'student'
                      ? 'bg-white text-impala-brown shadow-sm'
                      : 'bg-white text-emerald-600 shadow-sm'
                    : 'text-impala-charcoal-muted hover:text-impala-charcoal'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Card */}
        <div className={`card border-t-4 ${isStudent ? 'border-impala-brown' : 'border-emerald-500'}`}>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
              isStudent ? 'bg-impala-brown/10 text-impala-brown' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <FontAwesomeIcon icon={isStudent ? faUserGraduate : faChalkboardTeacher} className="text-xl" />
            </div>
            <h3 className="text-xl font-bold font-display text-impala-charcoal">
              {roleLabel} Login
            </h3>
            <p className="text-sm text-impala-charcoal-muted">
              Sign in as a {roleLabel.toLowerCase()}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  required
                  placeholder={`${roleLabel} email`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-impala-brown hover:text-impala-brown-dark">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
            disabled={formLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center space-x-2 ${
                isStudent
                  ? 'bg-impala-brown text-white hover:bg-impala-brown-dark'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              } disabled:opacity-50`}
          >
            {formLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <>
                  <span>{roleLabel} Login</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-impala-charcoal-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-impala-brown hover:text-impala-brown-dark font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
