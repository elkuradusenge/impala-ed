import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { useStudentDashboard } from '../../hooks/use-dashboard.hook';
import { useEnrolledCourses } from '../../hooks/use-enrollment.hook';
import StatCard from '../../components/StatCard.component';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCheckCircle, faGraduationCap, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStudentDashboard();
  const { data: courses, isLoading: coursesLoading } = useEnrolledCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Active Courses', value: stats?.activeEnrollments || 0, icon: <FontAwesomeIcon icon={faBookOpen} />, color: 'brown' as const },
    { label: 'Completed', value: stats?.completedCourses || 0, icon: <FontAwesomeIcon icon={faGraduationCap} />, color: 'green' as const },
    { label: 'Progress', value: `${stats?.overallProgress || 0}%`, icon: <FontAwesomeIcon icon={faChartLine} />, color: 'brown' as const },
    { label: 'Lessons Done', value: `${stats?.totalCompleted || 0}/${stats?.totalLessons || 0}`, icon: <FontAwesomeIcon icon={faCheckCircle} />, color: 'sand' as const },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">Welcome, {user?.name}</h1>
        <p className="text-impala-charcoal-muted">Track your learning progress.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {statCards.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      <div className="card-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal">My Courses</h2>
          <Link to="/courses" className="text-impala-brown hover:text-impala-brown-dark text-sm font-medium inline-flex items-center space-x-1">
            <span>Browse Courses</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>

        {(!courses || courses.length === 0) ? (
          <div className="text-center py-12 text-impala-charcoal-muted">
            <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-4 opacity-50" />
            <p>You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary inline-block mt-4">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((course: any) => (
              <div key={course.id || course._id} className="border border-impala-sand rounded-lg p-4 hover:shadow-sm transition-shadow bg-impala-ivory">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-impala-charcoal">{course.title}</h3>
                  {course.completed && <span className="badge-green">Completed</span>}
                </div>
                <p className="text-sm text-impala-charcoal-muted mb-3">
                  {(course.shortDescription || course.description || '').slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="progress-bar flex-1 mr-4">
                    <div className="progress-fill" style={{ width: `${course.completed ? 100 : stats?.overallProgress || 0}%` }} />
                  </div>
                  <Link to={`/learning/${course.id || course._id}`} className="text-impala-brown text-sm font-medium hover:underline">
                    {course.completed ? 'Review' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
