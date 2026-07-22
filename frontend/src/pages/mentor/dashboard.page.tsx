import { Link } from 'react-router-dom';
import { useMentorDashboard } from '../../hooks/use-dashboard.hook';
import StatCard from '../../components/StatCard.component';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCheckCircle, faUserGraduate, faClock, faArrowRight, faClipboardList, faChartLine, faComments } from '@fortawesome/free-solid-svg-icons';

const MentorDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useMentorDashboard();
  if (isLoading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: <FontAwesomeIcon icon={faBookOpen} />, color: 'brown' as const },
    { label: 'Published', value: stats?.publishedCourses || 0, icon: <FontAwesomeIcon icon={faCheckCircle} />, color: 'green' as const },
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: <FontAwesomeIcon icon={faUserGraduate} />, color: 'brown' as const },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: <FontAwesomeIcon icon={faClock} />, color: 'sand' as const },
  ];

  const links = [
    { to: '/mentor/courses', icon: faBookOpen, title: 'Course Management', desc: 'Create and manage your courses' },
    { to: '/mentor/assignments', icon: faClipboardList, title: 'Assignments', desc: 'Create assignments and review submissions' },
    { to: '/mentor/progress', icon: faChartLine, title: 'Student Progress', desc: 'Monitor student learning progress' },
    { to: '/messages', icon: faComments, title: 'Messages', desc: 'Communicate with students' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Mentor Dashboard</h1>
      <p className="text-impala-charcoal-muted mb-8">Manage your courses and monitor students.</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => <StatCard key={i} label={c.label} value={c.value} icon={c.icon} color={c.color} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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

export default MentorDashboardPage;
