import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  /** When true, redirects authenticated users away (for login/register pages) */
  redirectIfAuthenticated?: boolean;
  /** Fallback redirect path */
  fallback?: string;
}

/**
 * RouteGuard - Protects routes based on authentication and role.
 *
 * - If loading, shows a spinner.
 * - If `redirectIfAuthenticated` is true and user is logged in, redirects to fallback.
 * - If user is not authenticated, redirects to /login.
 * - If `allowedRoles` is specified and user's role is not in the list, redirects to fallback.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  redirectIfAuthenticated = false,
  fallback = '/',
}) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-impala-ivory">
        <FontAwesomeIcon icon={faSpinner} spin className="text-impala-brown text-3xl" />
      </div>
    );
  }

  // Redirect authenticated users away from guest pages (login/register)
  if (redirectIfAuthenticated && isAuthenticated) {
    console.log(isAuthenticated)
    return <Navigate to={fallback + "?=isAuthenticated"} replace />;
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login?-" replace />;
  }

  // Check role-based access
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
