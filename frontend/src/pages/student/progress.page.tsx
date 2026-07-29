import { Link } from 'react-router-dom';
import { useEnrolledCourses } from '../../hooks/use-enrollment.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faFileAlt, faCheckCircle, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons';

const ProgressPage: React.FC = () => {
  const { data: courses, isLoading: coursesLoading } = useEnrolledCourses();

  if (coursesLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-8">Learning Progress</h1>

      <div className="card-white mb-6">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-impala-brown" />
          Course Progress
        </h2>
        {(!courses || courses.length === 0) ? (
          <p className="text-impala-charcoal-muted text-center py-8">You are not enrolled in any courses.</p>
        ) : (
          <div className="space-y-6">
            {courses.map((course: any) => (
              <div key={course.id || course._id} className="border-b border-impala-sand pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link to={`/learning/${course.id || course._id}`} className="font-medium text-impala-charcoal hover:text-impala-brown">
                      {course.title}
                    </Link>
                    <p className="text-sm text-impala-charcoal-muted">Mentor: {course.mentor?.name}</p>
                  </div>
                  {course.completed && <span className="badge-green"><FontAwesomeIcon icon={faCheckCircle} className="mr-1" />Completed</span>}
                </div>
                <div className="flex items-center space-x-4 text-sm text-impala-charcoal-muted mb-2">
                  <span><FontAwesomeIcon icon={faBookOpen} className="mr-1" />{course.modules?.length || 0} modules</span>
                  <span><FontAwesomeIcon icon={faCheckCircle} className="mr-1" />{course.completedLessons?.length || 0} lessons done</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="progress-bar flex-1">
                    <div className="progress-fill" style={{ width: `${Math.min(course.completionPercentage || 0, 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-impala-green">{course.completionPercentage || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
