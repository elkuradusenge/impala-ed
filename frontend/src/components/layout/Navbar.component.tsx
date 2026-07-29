import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faSignOutAlt,
  faBars,
  faTimes,
  faCommentDots,
  faUser,
  faTachometerAlt,
  faBook,
  faChartLine,
  faPlusCircle,
  faUserGraduate,
  faUsers,
  faCog,
  faHome,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

/* ── Navigation item definition ── */
interface NavItem {
  label: string;
  to: string;
  icon: any;
}

/* ── Role-specific nav links ── */
const GUEST_LINKS: NavItem[] = [
  { label: 'Home', to: '/', icon: faHome },
  { label: 'About Us', to: '/about', icon: faBook },
];

const STUDENT_LINKS: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard', icon: faTachometerAlt },
  { label: 'My Courses', to: '/courses', icon: faBookOpen },
  { label: 'Learning Progress', to: '/progress', icon: faChartLine },
];

const MENTOR_LINKS: NavItem[] = [
  { label: 'Dashboard', to: '/mentor/dashboard', icon: faTachometerAlt },
  { label: 'My Courses', to: '/mentor/courses', icon: faBookOpen },
  { label: 'Create Course', to: '/mentor/courses', icon: faPlusCircle },
  { label: 'Assignments', to: '/mentor/assignments', icon: faClipboardList },
  { label: 'Students', to: '/mentor/progress', icon: faUserGraduate },
];

const ADMIN_LINKS: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: faTachometerAlt },
  { label: 'Users', to: '/admin/users', icon: faUsers },
  { label: 'Courses', to: '/admin/courses', icon: faBookOpen },
  { label: 'System Settings', to: '/admin/settings', icon: faCog },
];

/* ── Get links for current role ── */
function getRoleLinks(role?: string): NavItem[] {
  switch (role) {
    case 'student':
      return STUDENT_LINKS;
    case 'mentor':
      return MENTOR_LINKS;
    case 'admin':
      return ADMIN_LINKS;
    default:
      return GUEST_LINKS;
  }
}

const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = isAuthenticated ? getRoleLinks(role || undefined) : GUEST_LINKS;

  return (
    <nav className="bg-impala-brown text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faBookOpen} className="text-impala-sand text-xl" />
            <span className="text-xl font-bold font-display tracking-wide">ImpalaEd</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-impala-sand hover:text-white transition-colors text-sm font-medium"
              >
                <FontAwesomeIcon icon={link.icon} className="mr-1.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className="text-impala-sand hover:text-white transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faCommentDots} className="mr-1" />
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-impala-sand hover:text-white transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-impala-sand hover:text-white transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-impala-sand hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-impala-sand text-impala-brown px-4 py-2 rounded-lg hover:bg-impala-sand-dark transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-impala-sand hover:text-white"
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-impala-sand hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={link.icon} className="mr-2" />
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/messages"
                  className="block py-2 text-impala-sand hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faCommentDots} className="mr-2" /> Messages
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-impala-sand hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-impala-sand hover:text-white w-full text-left">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
