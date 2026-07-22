import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses } from '../../hooks/use-courses.hook';
import { useEnrolledCourses } from '../../hooks/use-enrollment.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBookOpen, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

const CourseCataloguePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { isAuthenticated } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const { data: enrolledCourses } = useEnrolledCourses(isAuthenticated);

  const enrolledIds = new Set((enrolledCourses || []).map((c: any) => c.id || c._id));

  const filtered = (courses || []).filter(
    (c: any) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">Course Catalogue</h1>
        <p className="text-impala-charcoal-muted mb-4">Browse and enroll in available courses</p>
        <div className="relative max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted" />
          <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-impala-charcoal-muted">
          <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4 opacity-50" />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course: any) => (
            <div key={course.id || course._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="badge-brown">{course.difficultyLevel}</span>
                {enrolledIds.has(course.id || course._id) && (
                  <span className="badge-green">Enrolled</span>
                )}
              </div>
              <h3 className="text-lg font-semibold font-display text-impala-charcoal mb-2">{course.title}</h3>
              <p className="text-sm text-impala-charcoal-muted mb-4 line-clamp-2">
                {(course.shortDescription || course.description || '').slice(0, 120)}
              </p>
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
              <Link to={`/courses/${course.id || course._id}`} className="btn-primary w-full text-center block">
                {isAuthenticated && enrolledIds.has(course.id || course._id) ? 'View Course' : 'View Details'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCataloguePage;
