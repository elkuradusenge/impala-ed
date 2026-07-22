import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses } from '../../hooks/use-courses.hook';
import { useQuery } from '@tanstack/react-query';
import * as progressService from '../../services/progress.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChartLine, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const StudentProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { data: courses } = useCourses({ mentor: user?.id || '' });
  const [selectedCourse, setSelectedCourse] = useState('');
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['studentProgress', selectedCourse],
    queryFn: () => progressService.getStudentProgressByMentor(selectedCourse),
    enabled: !!selectedCourse,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Student Progress</h1>
      <p className="text-impala-charcoal-muted mb-6">Monitor your students' learning progress</p>

      <div className="card-white mb-6">
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="input-field max-w-md">
          <option value="">Select a course...</option>
          {(courses || []).map((c: any) => (
            <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="card-white">
          {isLoading ? <LoadingSpinner /> : (!progressData || progressData.length === 0) ? (
            <p className="text-center text-impala-charcoal-muted py-8">No students enrolled in this course yet.</p>
          ) : (
            <div className="space-y-4">
              {progressData.map((item: any) => (
                <div key={item.student?.id || item.student?._id} className="border border-impala-sand rounded-lg p-4 bg-impala-ivory">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-impala-charcoal">
                        <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-impala-brown" />
                        {item.student?.name}
                      </p>
                      <p className="text-sm text-impala-charcoal-muted">{item.student?.email}</p>
                    </div>
                    {item.completed && <span className="badge-green"><FontAwesomeIcon icon={faCheckCircle} className="mr-1" />Completed</span>}
                  </div>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="progress-bar flex-1">
                      <div className="progress-fill" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium text-impala-green">{item.percentage}%</span>
                    <span className="text-xs text-impala-charcoal-muted">{item.completedLessons}/{item.totalLessons} lessons</span>
                  </div>
                  {item.assignments?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-impala-sand">
                      <p className="text-xs text-impala-charcoal-muted mb-1">Assignments:</p>
                      {item.assignments.map((sub: any) => (
                        <div key={sub.id || sub._id} className="flex justify-between text-sm">
                          <span className="text-impala-charcoal">{sub.assignment?.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            sub.status === 'reviewed' ? 'badge-green' : sub.status === 'submitted' ? 'badge-brown' : 'badge-sand'
                          }`}>{sub.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentProgressPage;
