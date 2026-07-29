import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourseById } from '../../hooks/use-courses.hook';
import { useCheckEnrollment, useEnrollCourse } from '../../hooks/use-enrollment.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faFolder, faList, faBookOpen, faArrowRight, faSignInAlt, faFilePdf, faSpinner, faLock } from '@fortawesome/free-solid-svg-icons';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, isMentor } = useAuth();
  const { data: course, isLoading } = useCourseById(id!);
  const { data: enrollment } = useCheckEnrollment(id!, isAuthenticated && isStudent);
  const enrollMutation = useEnrollCourse();

  const handleEnroll = async () => {
    if (!id) return;
    try {
      await enrollMutation.mutateAsync(id);
      toast.success('Successfully enrolled in course!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
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
            {course.enrollmentCount !== undefined && (
              <span className="text-xs text-impala-charcoal-muted">
                {course.enrollmentCount} student(s) enrolled
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

        {/* Action buttons based on auth state & role */}
        <div className="flex flex-wrap items-center gap-3">
          {!isAuthenticated ? (
            <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Sign In to Enroll</span>
            </Link>
          ) : isStudent ? (
            isEnrolled ? (
              <button onClick={() => navigate(`/learning/${course.id}`)} className="btn-primary inline-flex items-center space-x-2">
                <FontAwesomeIcon icon={faBookOpen} />
                <span>Continue Learning</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button onClick={handleEnroll} disabled={enrollMutation.isPending} className="btn-primary inline-flex items-center space-x-2">
                {enrollMutation.isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <span>Enroll Now</span>
                )}
              </button>
            )
          ) : isMentor ? (
            <Link to="/mentor/courses" className="text-sm text-impala-charcoal-muted hover:text-impala-brown">
              View in Course Management →
            </Link>
          ) : null}
        </div>
      </div>

      {/* Course Materials (PDFs uploaded by teacher) — gated behind enrollment */}
      {course.courseMaterials && course.courseMaterials.length > 0 && (
        <div className="card-white mb-6">
          <h2 className="text-xl font-semibold font-display text-impala-charcoal mb-4">
            <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-impala-brown" />
            Course Materials ({course.courseMaterials.length})
          </h2>
          {isAuthenticated && isStudent && isEnrolled ? (
            <div className="space-y-2">
              {course.courseMaterials.map((pdf: any) => (
                <div key={pdf.id} className="flex items-center justify-between border border-impala-sand rounded-lg p-3 bg-impala-ivory">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-impala-charcoal">{pdf.title || pdf.originalName}</p>
                      <p className="text-xs text-impala-charcoal-muted">
                        {pdf.fileSize ? `${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/learning/${course.id}`)}
                    className="text-impala-brown hover:text-impala-brown-dark text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
                    Open in Learning
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-impala-charcoal-muted py-3">
              <FontAwesomeIcon icon={faLock} />
              <p className="text-sm">
                {!isAuthenticated
                  ? 'Sign in and enroll to access course materials.'
                  : isStudent
                  ? 'Enroll in this course to access materials.'
                  : 'Course materials are available to enrolled students.'}
              </p>
            </div>
          )}
        </div>
      )}

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
