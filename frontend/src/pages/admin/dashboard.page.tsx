import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/use-dashboard.hook';
import StatCard from '../../components/StatCard.component';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserGraduate, faUserTie, faBookOpen, faCheckCircle, faClipboardList, faChartLine, faCog, faComments, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useAdminDashboard();
  if (isLoading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FontAwesomeIcon icon={faUsers} />, color: 'brown' as const },
    { label: 'Students', value: stats?.totalStudents || 0, icon: <FontAwesomeIcon icon={faUserGraduate} />, color: 'green' as const },
    { label: 'Mentors', value: stats?.totalMentors || 0, icon: <FontAwesomeIcon icon={faUserTie} />, color: 'brown' as const },
    { label: 'Courses', value: stats?.totalCourses || 0, icon: <FontAwesomeIcon icon={faBookOpen} />, color: 'sand' as const },
    { label: 'Published', value: stats?.publishedCourses || 0, icon: <FontAwesomeIcon icon={faCheckCircle} />, color: 'green' as const },
    { label: 'Active Enrollments', value: stats?.activeEnrollments || 0, icon: <FontAwesomeIcon icon={faChartLine} />, color: 'brown' as const },
    { label: 'Completed', value: stats?.completedCourses || 0, icon: <FontAwesomeIcon icon={faCheckCircle} />, color: 'green' as const },
    { label: 'Assignments', value: stats?.totalAssignments || 0, icon: <FontAwesomeIcon icon={faClipboardList} />, color: 'sand' as const },
  ];

  const links = [
    { to: '/admin/users', icon: faUsers, title: 'User Management', desc: 'Manage students, mentors, and admins' },
    { to: '/admin/courses', icon: faBookOpen, title: 'Course Management', desc: 'Approve and manage courses' },
    { to: '/admin/reports', icon: faChartLine, title: 'Reports', desc: 'View platform analytics' },
    { to: '/admin/settings', icon: faCog, title: 'Settings', desc: 'Configure platform settings' },
    { to: '/messages', icon: faComments, title: 'Messages', desc: 'Moderate conversations' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Admin Dashboard</h1>
      <p className="text-impala-charcoal-muted mb-8">Platform overview and management</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => <StatCard key={i} label={c.label} value={c.value} icon={c.icon} color={c.color} />)}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {links.map((l, i) => (
          <Link key={i} to={l.to} className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={l.icon} className="text-impala-brown text-3xl" />
              <div className="flex-1">
                <h3 className="font-semibold font-display text-impala-charcoal">{l.title}</h3>
                <p className="text-sm text-impala-charcoal-muted">{l.desc}</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-impala-brown opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
