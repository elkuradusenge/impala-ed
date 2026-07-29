import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses } from '../../hooks/use-courses.hook';
import { useEnrolledCourses, useEnrollCourse } from '../../hooks/use-enrollment.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUser, faLock, faArrowRight, faBookOpen, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PublicCoursesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, isMentor } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const { data: enrolledCourses } = useEnrolledCourses(isAuthenticated);
  const enrollMutation = useEnrollCourse();

  const enrolledIds = new Set((enrolledCourses || []).map((c: any) => c.id));

  const filtered = (courses || []).filter(
    (c: any) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success('Successfully enrolled in course!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">Explore Courses</h1>
        <p className="text-impala-charcoal-muted mb-4">
          Browse our complete course catalog. {!isAuthenticated && 'Sign in to enroll and start learning.'}
        </p>
        <div className="relative max-w-md">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-impala-charcoal-muted">
          <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4 opacity-50" />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course: any) => {
            const courseId = course.id;
            const isEnrolled = enrolledIds.has(courseId);
            const isEnrolling = enrollingId === courseId;

            return (
              <div key={courseId} className="card hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge-brown">{course.difficultyLevel}</span>
                  {isEnrolled && (
                    <span className="badge-green">Enrolled</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold font-display text-impala-charcoal mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-impala-charcoal-muted mb-4 line-clamp-2 flex-1">
                  {(course.shortDescription || course.description || '').slice(0, 120)}
                </p>
                {course.category && (
                  <p className="text-xs text-impala-brown mb-2">{course.category.name}</p>
                )}
                <div className="flex items-center text-sm text-impala-charcoal-muted mb-4 space-x-4">
                  <span className="inline-flex items-center space-x-1">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    <span>{course.duration || 'Self-paced'}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <FontAwesomeIcon icon={faUser} className="text-xs" />
                    <span>{course.mentor?.name || 'Unknown'}</span>
                  </span>
                </div>

                {/* Action buttons based on auth state */}
                <div className="mt-auto space-y-2">
                  <Link
                    to={`/courses/${courseId}`}
                    className="btn-outline w-full text-center block text-sm"
                  >
                    View Details
                  </Link>

                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="text-xs text-center text-impala-charcoal-muted hover:text-impala-brown inline-flex items-center justify-center space-x-1 w-full"
                    >
                      <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                      <span>Sign in to enroll</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </Link>
                  ) : isStudent ? (
                    isEnrolled ? (
                      <button
                        onClick={() => navigate(`/learning/${courseId}`)}
                        className="btn-primary w-full text-center text-sm"
                      >
                        <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
                        Continue Learning
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(courseId)}
                        disabled={isEnrolling}
                        className="btn-primary w-full text-center text-sm"
                      >
                        {isEnrolling ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" />
                            Enrolling...
                          </>
                        ) : (
                          'Enroll Now'
                        )}
                      </button>
                    )
                  ) : isMentor ? (
                    <Link
                      to={`/mentor/courses`}
                      className="text-xs text-center text-impala-charcoal-muted hover:text-impala-brown w-full block"
                    >
                      Go to Course Management
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicCoursesPage;
