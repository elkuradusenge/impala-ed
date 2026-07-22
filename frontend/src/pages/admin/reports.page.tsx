import { useAdminDashboard } from '../../hooks/use-dashboard.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBookOpen, faGraduationCap, faChartLine, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const ReportsPage: React.FC = () => {
  const { data: stats, isLoading } = useAdminDashboard();
  if (isLoading) return <LoadingSpinner />;

  const sections = [
    {
      title: 'User Statistics',
      icon: faUsers,
      items: [
        { label: 'Total Users', value: stats?.totalUsers || 0 },
        { label: 'Students', value: stats?.totalStudents || 0 },
        { label: 'Mentors', value: stats?.totalMentors || 0 },
      ],
    },
    {
      title: 'Course Statistics',
      icon: faBookOpen,
      items: [
        { label: 'Total Courses', value: stats?.totalCourses || 0 },
        { label: 'Published', value: stats?.publishedCourses || 0 },
        { label: 'Assignments', value: stats?.totalAssignments || 0 },
      ],
    },
    {
      title: 'Enrollment Statistics',
      icon: faGraduationCap,
      items: [
        { label: 'Active Enrollments', value: stats?.activeEnrollments || 0 },
        { label: 'Completed Courses', value: stats?.completedCourses || 0 },
        {
          label: 'Completion Rate',
          value: ((stats?.totalCourses && ((stats?.activeEnrollments || 0) + (stats?.completedCourses || 0)) > 0)
            ? Math.round(((stats?.completedCourses || 0) / ((stats?.activeEnrollments || 0) + (stats?.completedCourses || 0))) * 100)
            : 0) + '%',
        },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Reports & Analytics</h1>
      <p className="text-impala-charcoal-muted mb-6">Platform usage and performance statistics</p>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((sec, i) => (
          <div key={i} className="card-white">
            <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
              <FontAwesomeIcon icon={sec.icon} className="mr-2 text-impala-brown" /> {sec.title}
            </h2>
            <div className="space-y-4">
              {sec.items.map((item, j) => (
                <div key={j} className="flex justify-between items-center p-3 bg-impala-sand rounded-lg">
                  <span className="text-sm font-medium text-impala-charcoal">{item.label}</span>
                  <span className="text-2xl font-bold text-impala-brown font-display">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card-white">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-impala-brown" /> Platform Metrics
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-impala-sand rounded-lg">
              <p className="text-sm text-impala-charcoal-muted">
                Student-to-Mentor Ratio:{' '}
                <strong className="text-impala-charcoal">
                  {(stats?.totalMentors || 0) > 0 ? ((stats?.totalStudents || 0) / (stats?.totalMentors || 1)).toFixed(1) : 'N/A'}
                </strong>
              </p>
            </div>
            <div className="p-3 bg-impala-sand rounded-lg">
              <p className="text-sm text-impala-charcoal-muted">
                Avg Enrollments per Course:{' '}
                <strong className="text-impala-charcoal">
                  {(stats?.totalCourses || 0) > 0 ? (((stats?.activeEnrollments || 0) + (stats?.completedCourses || 0)) / (stats?.totalCourses || 1)).toFixed(1) : 'N/A'}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="card-white">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-impala-brown" /> Quick Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Users', value: stats?.totalUsers || 0 },
              { label: 'Total Courses', value: stats?.totalCourses || 0 },
              { label: 'Active Enrollments', value: stats?.activeEnrollments || 0 },
              { label: 'Completed', value: stats?.completedCourses || 0 },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-impala-sand rounded-lg text-center">
                <p className="text-2xl font-bold text-impala-brown font-display">{item.value}</p>
                <p className="text-xs text-impala-charcoal-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
