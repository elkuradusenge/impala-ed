import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/use-courses.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUser, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const PublicCoursesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: courses, isLoading } = useCourses();

  const filtered = (courses || []).filter(
    (c: any) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">Explore Courses</h1>
        <p className="text-impala-charcoal-muted mb-4">
          Browse our available courses. Sign in to enroll and start learning.
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
          {filtered.map((course: any) => (
            <div key={course.id || course._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="badge-brown">{course.difficultyLevel}</span>
              </div>
              <h3 className="text-lg font-semibold font-display text-impala-charcoal mb-2">
                {course.title}
              </h3>
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
              <div className="flex flex-col space-y-2">
                <Link
                  to={`/courses/${course.id || course._id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details
                </Link>
                <Link
                  to="/login"
                  className="text-xs text-center text-impala-charcoal-muted hover:text-impala-brown inline-flex items-center justify-center space-x-1"
                >
                  <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                  <span>Sign in to enroll</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicCoursesPage;
