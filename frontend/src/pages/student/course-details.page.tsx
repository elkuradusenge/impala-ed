import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourseById } from '../../hooks/use-courses.hook';
import { useCheckEnrollment, useEnrollCourse } from '../../hooks/use-enrollment.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faFolder, faList, faBookOpen, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: course, isLoading } = useCourseById(id!);
  const { data: enrollment } = useCheckEnrollment(id!, isAuthenticated);
  const enrollMutation = useEnrollCourse();

  const handleEnroll = async () => {
    if (!id) return;
    try {
      await enrollMutation.mutateAsync(id);
    } catch (_) {}
  };

  if (isLoading) return <LoadingSpinner />;
  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-impala-charcoal-muted">Course not found</p>
        <Link to="/courses" className="btn-primary inline-block mt-4">Browse Courses</Link>
      </div>
    );
  }

  const isEnrolled = enrollment?.enrolled || false;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-white mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold font-display text-impala-charcoal mb-2">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-impala-charcoal-muted">
            <span className="badge-brown">{course.difficultyLevel}</span>
            {course.duration && (
              <span className="inline-flex items-center space-x-1">
                <FontAwesomeIcon icon={faClock} className="text-xs" />
                <span>{course.duration}</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1">
              <FontAwesomeIcon icon={faUser} className="text-xs" />
              <span>Mentor: {course.mentor?.name}</span>
            </span>
            {course.category?.name && (
              <span className="inline-flex items-center space-x-1">
                <FontAwesomeIcon icon={faFolder} className="text-xs" />
                <span>{course.category.name}</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-impala-charcoal mb-6 leading-relaxed">{course.description}</p>

        {course.learningObjectives && course.learningObjectives.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-impala-charcoal mb-2 font-display">Learning Objectives</h3>
            <ul className="space-y-1 text-impala-charcoal-muted">
              {course.learningObjectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-impala-green mt-1">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isAuthenticated && isEnrolled ? (
          <button onClick={() => navigate(`/learning/${course.id}`)} className="btn-primary inline-flex items-center space-x-2">
            <span>Start Learning</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : (
          <button onClick={handleEnroll} disabled={enrollMutation.isPending} className="btn-primary">
            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
          </button>
        )}
      </div>

      <div className="card-white">
        <h2 className="text-xl font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faList} className="mr-2 text-impala-brown" />
          Course Modules
        </h2>
        {course.modules && course.modules.length > 0 ? (
          <div className="space-y-4">
            {course.modules.map((mod: any, idx: number) => (
              <div key={mod.id} className="border border-impala-sand rounded-lg p-4 bg-impala-ivory">
                <h3 className="font-medium text-impala-charcoal">
                  Module {idx + 1}: {mod.title}
                </h3>
                {mod.description && <p className="text-sm text-impala-charcoal-muted mt-1">{mod.description}</p>}
                <p className="text-xs text-impala-charcoal-muted mt-2">
                  <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
                  {mod.lessons?.length || 0} lesson(s)
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-impala-charcoal-muted">No modules yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
