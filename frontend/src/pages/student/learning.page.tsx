import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseById } from '../../hooks/use-courses.hook';
import { useLessonProgress, useCompleteLesson } from '../../hooks/use-lessons.hook';
import { getPDFUrl } from '../../services/pdf.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faFilePdf, faGraduationCap, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const LearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourseById(courseId!);
  const { data: progress, refetch: refetchProgress } = useLessonProgress(courseId!);
  const completeMutation = useCompleteLesson();

  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);

  useEffect(() => {
    if (course?.modules && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.lessons?.length > 0) {
        setCurrentLesson(firstModule.lessons[0]);
        setCurrentModule(firstModule);
      }
    }
  }, [course]);

  const handleLessonSelect = (mod: any, lesson: any) => {
    setCurrentModule(mod);
    setCurrentLesson(lesson);
  };

  const handleComplete = async () => {
    if (!currentLesson) return;
    try {
      await completeMutation.mutateAsync(currentLesson.id || currentLesson._id);
      refetchProgress();
    } catch (_) {}
  };

  if (isLoading) return <LoadingSpinner />;
  if (!course) {
    return <div className="text-center py-20"><p className="text-impala-charcoal-muted">Course not found</p></div>;
  }

  const completedLessons: string[] = progress?.completedLessons || [];
  const isCompleted = (lesson: any) => completedLessons.includes(lesson.id || lesson._id);
  const isCurrent = (lesson: any) => (currentLesson?.id || currentLesson?._id) === (lesson.id || lesson._id);

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-80 shrink-0">
        <div className="card-white sticky top-4">
          <h2 className="font-semibold font-display text-impala-charcoal mb-1">{course.title}</h2>
          {progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-impala-charcoal-muted mb-1">
                <span>Progress</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-4 mt-4">
            {course.modules?.map((mod: any, modIdx: number) => (
              <div key={mod.id || mod._id}>
                <h3 className="text-sm font-medium text-impala-charcoal mb-2">Module {modIdx + 1}: {mod.title}</h3>
                <div className="space-y-1 ml-2">
                  {mod.lessons?.map((lesson: any) => (
                    <button
                      key={lesson.id || lesson._id}
                      onClick={() => handleLessonSelect(mod, lesson)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                        isCurrent(lesson)
                          ? 'bg-impala-brown/10 text-impala-brown font-medium'
                          : isCompleted(lesson)
                          ? 'text-impala-green'
                          : 'text-impala-charcoal-muted hover:bg-impala-sand'
                      }`}
                    >
                      <FontAwesomeIcon icon={isCompleted(lesson) ? faCheckCircle : faCircle} className="text-xs" />
                      <span>{lesson.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {currentLesson ? (
          <div>
            <div className="card-white mb-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold font-display text-impala-charcoal">{currentLesson.title}</h2>
                {currentModule && <p className="text-sm text-impala-charcoal-muted">{currentModule.title}</p>}
              </div>

              {currentLesson.description && (
                <p className="text-impala-charcoal-muted mb-4">{currentLesson.description}</p>
              )}

              {currentLesson.pdfDocument ? (
                <div className="rounded-lg overflow-hidden border border-impala-sand">
                  <iframe
                    src={getPDFUrl(currentLesson.pdfDocument.id || currentLesson.pdfDocument._id)}
                    className="w-full h-[70vh]"
                    title={currentLesson.pdfDocument.title}
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-impala-sand rounded-lg">
                  <FontAwesomeIcon icon={faFilePdf} className="text-4xl mb-4 text-impala-charcoal-muted opacity-50" />
                  <p className="text-impala-charcoal-muted">No PDF document attached to this lesson</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleComplete}
                  className="btn-success inline-flex items-center space-x-2"
                  disabled={isCompleted(currentLesson) || completeMutation.isPending}
                >
                  <FontAwesomeIcon icon={isCompleted(currentLesson) ? faCheckCircle : faCircle} />
                  <span>
                    {completeMutation.isPending
                      ? 'Completing...'
                      : isCompleted(currentLesson)
                      ? 'Completed'
                      : 'Mark as Completed'}
                  </span>
                </button>
              </div>
            </div>

            {progress?.completed && (
              <div className="card-white bg-impala-green/5 border-impala-green/20">
                <h3 className="font-semibold text-impala-green mb-2 font-display">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                  Course Completed!
                </h3>
                <p className="text-impala-green/80 mb-4">You have completed all lessons. You can now access the assignment.</p>
                <Link to={`/assignments/${courseId}`} className="btn-success inline-flex items-center space-x-2">
                  <span>View Assignment</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 card-white">
            <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-4 text-impala-charcoal-muted opacity-50" />
            <p className="text-impala-charcoal-muted">Select a lesson from the sidebar to begin learning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
