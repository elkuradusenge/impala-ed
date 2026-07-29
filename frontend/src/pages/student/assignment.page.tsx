import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAssignmentsByCourse, useStartAttempt, useSaveAnswer, useSubmitAttempt, useAttemptById, useMyAttempts } from '../../hooks/use-assignments.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faCircle, faTimesCircle, faQuestionCircle, faArrowLeft, faArrowRight, faSpinner, faFlag, faCheckDouble, faBookOpen } from '@fortawesome/free-solid-svg-icons';

type Phase = 'intro' | 'taking' | 'results';

const AssessmentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: assignments, isLoading } = useAssignmentsByCourse(courseId!);
  const assignment = assignments?.[0];
  const startMut = useStartAttempt();
  const saveMut = useSaveAnswer();
  const submitMut = useSubmitAttempt();
  const { data: prevAttempts } = useMyAttempts(assignment?.id || '');

  const [phase, setPhase] = useState<Phase>('intro');
  const [attempt, setAttempt] = useState<any>(null);
  const [ci, setCi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [confirm, setConfirm] = useState(false);
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});

  const autoSave = useCallback(async () => {
    if (!attempt || phase !== 'taking' || !assignment) return;
    const q = assignment.questions[ci];
    if (!q) return;
    const val = q.questionType === 'multiple_choice' ? answers[q.id] : textAnswers[q.id];
    if (val !== undefined) {
      try { await saveMut.mutateAsync({ attemptId: attempt.id, questionId: q.id, answer: textAnswers[q.id] || '', selectedOptionId: answers[q.id] || null }); } catch {}
    }
  }, [attempt, phase, assignment, ci, answers, textAnswers, saveMut]);

  useEffect(() => { const i = setInterval(autoSave, 10000); return () => clearInterval(i); }, [autoSave]);

  const handleStart = async () => {
    if (!assignment) return;
    try {
      const r = await startMut.mutateAsync(assignment.id);
      setAttempt(r); setPhase('taking');
      const saved: Record<string, string> = {};
      const texts: Record<string, string> = {};
      (r.answers || []).forEach((a: any) => {
        if (a.selectedOptionId) saved[a.questionId] = a.selectedOptionId;
        if (a.answer) texts[a.questionId] = a.answer;
      });
      setAnswers(saved); setTextAnswers(texts);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to start'); }
  };

  const handleSelect = (qId: string, optId: string) => {
    const q = assignment?.questions.find(x => x.id === qId);
    if (q?.questionType === 'multiple_choice') setAnswers(p => ({ ...p, [qId]: optId }));
  };

  const handleSubmit = async () => {
    if (!attempt || !assignment) return;
    try {
      const q = assignment.questions[ci];
      if (q) {
        const val = q.questionType === 'multiple_choice' ? answers[q.id] : textAnswers[q.id];
        await saveMut.mutateAsync({ attemptId: attempt.id, questionId: q.id, answer: textAnswers[q.id] || '', selectedOptionId: answers[q.id] || null });
      }
      const r = await submitMut.mutateAsync(attempt.id);
      setResults(r); setPhase('results');
      toast.success('Assessment submitted!');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Submission failed'); }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!assignment) return <div className="text-center py-20"><p className="text-impala-charcoal-muted">No assessment available for this course yet.</p></div>;

  const questions = assignment.questions || [];
  const answered = assignment.questions?.[0]?.questionType === 'multiple_choice' ? Object.keys(answers).length : Object.keys(textAnswers).length;
  const total = questions.length;
  const unanswered = total - answered;

  // Intro
  if (phase === 'intro') {
    const subCount = prevAttempts?.filter((a: any) => a.status === 'submitted').length || 0;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-white text-center">
          <div className="w-16 h-16 bg-impala-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-2xl text-impala-brown" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">{assignment.title}</h1>
          {assignment.description && <p className="text-impala-charcoal-muted mb-6">{assignment.description}</p>}
          <div className="grid md:grid-cols-2 gap-4 text-left mb-6 max-w-sm mx-auto">
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Questions</p><p className="font-semibold">{questions.length}</p></div>
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Total Points</p><p className="font-semibold">{assignment.totalPoints}</p></div>
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Passing Score</p><p className="font-semibold">{assignment.passingScore}%</p></div>
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Attempts</p><p className="font-semibold">{subCount}/{assignment.maxAttempts}</p></div>
            {assignment.timeLimit && <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Time Limit</p><p className="font-semibold">{assignment.timeLimit} min</p></div>}
            {assignment.dueDate && <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Due</p><p className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</p></div>}
          </div>
          <button onClick={handleStart} disabled={startMut.isPending} className="btn-primary text-lg px-8">
            {startMut.isPending ? <><FontAwesomeIcon icon={faSpinner} spin className="mr-1" /> Starting...</> : 'Start Assessment'}
          </button>
        </div>
      </div>
    );
  }

  // Taking
  if (phase === 'taking' && questions.length > 0) {
    const q = questions[ci];
    const hasMultipleChoice = questions.some((x: any) => x.questionType === 'multiple_choice');
    const answeredCount = hasMultipleChoice ? Object.keys(answers).length : Object.keys(textAnswers).filter(k => textAnswers[k].trim()).length;

    return (
      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <div className="card-white sticky top-4">
            <h3 className="font-semibold mb-1">{assignment.title}</h3>
            <div className="text-sm text-impala-charcoal-muted mb-3">{answeredCount}/{total} answered</div>
            <div className="progress-bar mb-4"><div className="progress-fill" style={{ width: `${(answeredCount / total) * 100}%` }} /></div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q: any, i: number) => {
                const done = q.questionType === 'multiple_choice' ? !!answers[q.id] : !!textAnswers[q.id]?.trim();
                return (
                  <button key={q.id} onClick={() => setCi(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      i === ci ? 'bg-impala-brown text-white' :
                      done ? 'bg-impala-green/20 text-impala-green border border-impala-green/40' :
                      'bg-impala-sand text-impala-charcoal-muted'
                    }`}>{i + 1}</button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-impala-charcoal-muted">
              <span className="w-3 h-3 rounded bg-impala-green/20 border border-impala-green/40 inline-block" /> Answered
              <span className="w-3 h-3 rounded bg-impala-sand inline-block ml-2" /> Unanswered
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="card-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-impala-charcoal-muted">Question {ci + 1} of {total}</span>
              <span className="badge-brown">{q.points} points</span>
            </div>
            <h2 className="text-lg font-semibold mb-6">{q.questionText}</h2>

            {q.questionType === 'multiple_choice' ? (
              <div className="space-y-2">
                {(q.options || []).map((o: any) => {
                  const sel = answers[q.id] === o.id;
                  return (
                    <button key={o.id} onClick={() => handleSelect(q.id, o.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        sel ? 'border-impala-brown bg-impala-brown/5' : 'border-impala-sand hover:border-impala-brown/50'
                      }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel ? 'border-impala-brown' : 'border-impala-charcoal-muted'}`}>
                          {sel && <div className="w-2.5 h-2.5 rounded-full bg-impala-brown" />}
                        </div>
                        <span className="text-sm">{o.optionText}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea value={textAnswers[q.id] || ''} onChange={e => setTextAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                className="input-field w-full" rows={6} placeholder="Type your answer here..." />
            )}

            <div className="flex justify-between items-center mt-8">
              <button onClick={() => setCi(Math.max(0, ci - 1))} disabled={ci === 0} className="btn-outline text-sm">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Previous
              </button>
              {ci < total - 1 ? (
                <button onClick={() => setCi(ci + 1)} className="btn-primary text-sm">
                  Next <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                </button>
              ) : (
                <button onClick={() => setConfirm(true)} className="btn-primary text-sm">
                  <FontAwesomeIcon icon={faCheckDouble} className="mr-1" /> Submit
                </button>
              )}
            </div>
          </div>
          {unanswered > 0 && ci === total - 1 && (
            <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faFlag} className="mr-1" /> {unanswered} question(s) not yet answered.
            </div>
          )}
        </div>

        {confirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold mb-3">Submit Assessment?</h3>
              <p className="text-impala-charcoal-muted mb-4">Are you sure you want to submit? You will not be able to change your answers after submission.</p>
              {unanswered > 0 && <div className="bg-amber-50 text-amber-700 p-3 rounded-lg mb-4 text-sm"><FontAwesomeIcon icon={faFlag} className="mr-1" /> {unanswered} question(s) unanswered</div>}
              <div className="flex space-x-3">
                <button onClick={() => setConfirm(false)} className="btn-outline flex-1">Return to Assessment</button>
                <button onClick={handleSubmit} disabled={submitMut.isPending} className="btn-primary flex-1">{submitMut.isPending ? 'Submitting...' : 'Submit'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results
  if (phase === 'results' && results) {
    const passed = results.percentage >= assignment.passingScore;
    const subCount = prevAttempts?.filter((a: any) => a.status === 'submitted').length || 0;
    const mcqQuestions = results.assignment?.questions || [];

    return (
      <div className="max-w-3xl mx-auto">
        <div className={`card-white text-center mb-6 ${passed ? 'border-t-4 border-impala-green' : 'border-t-4 border-red-500'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-impala-green/10' : 'bg-red-50'}`}>
            <FontAwesomeIcon icon={passed ? faCheckCircle : faTimesCircle} className={`text-4xl ${passed ? 'text-impala-green' : 'text-red-500'}`} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">{passed ? 'Congratulations!' : 'Not Quite'}</h2>
          <p className="text-impala-charcoal-muted mb-6">{passed ? 'You passed the assessment!' : 'You did not meet the passing score.'}</p>
          <div className="grid md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Score</p><p className="text-xl font-bold">{results.score}/{assignment.totalPoints}</p></div>
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Percentage</p><p className="text-xl font-bold">{results.percentage}%</p></div>
            <div className="bg-impala-ivory rounded-lg p-3"><p className="text-xs text-impala-charcoal-muted">Status</p><p className={`text-xl font-bold ${passed ? 'text-impala-green' : 'text-red-500'}`}>{passed ? 'Passed' : 'Failed'}</p></div>
          </div>
          <button onClick={() => navigate(`/learning/${courseId}`)} className="btn-outline mr-3"><FontAwesomeIcon icon={faBookOpen} className="mr-1" /> Back to Course</button>
          {subCount < assignment.maxAttempts && <button onClick={handleStart} className="btn-primary">Retry</button>}
        </div>

        {(results.answers || []).length > 0 && assignment.showCorrectAnswers && (
          <div className="card-white">
            <h3 className="font-semibold mb-4">Question Breakdown</h3>
            <div className="space-y-4">
              {(results.answers || []).map((ans: any, idx: number) => {
                const q = mcqQuestions[idx];
                if (!q) return null;
                const isText = q.questionType === 'text';
                return (
                  <div key={ans.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">Question {idx + 1}</h4>
                      <span className={`text-sm font-medium ${ans.isCorrect || isText ? 'text-impala-green' : 'text-red-500'}`}>
                        {ans.pointsEarned}/{q.points} pts
                      </span>
                    </div>
                    <p className="mb-3">{q.questionText}</p>
                    {q.questionType === 'multiple_choice' ? (
                      <div className="space-y-1 text-sm">
                        {(q.options || []).map((o: any) => {
                          const sel = ans.selectedOptionId === o.id;
                          const correct = o.isCorrect;
                          let cls = 'text-impala-charcoal-muted'; let ic = faCircle;
                          if (correct) { cls = 'text-impala-green'; ic = faCheckCircle; }
                          if (sel && !correct) { cls = 'text-red-500'; ic = faTimesCircle; }
                          return (
                            <div key={o.id} className={`flex items-center space-x-2 ${cls}`}>
                              <FontAwesomeIcon icon={ic} className="text-xs" />
                              <span>{o.optionText}</span>
                              {correct && !sel && <span className="text-xs text-impala-green">(correct answer)</span>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-impala-ivory p-3 rounded text-sm">
                        <p className="font-medium text-impala-charcoal">Your answer:</p>
                        <p className="text-impala-charcoal-muted mt-1">{ans.answer || '(no answer)'}</p>
                      </div>
                    )}
                    {q.explanation && assignment.showExplanations && (
                      <div className="mt-2 text-sm text-impala-charcoal-muted bg-impala-ivory p-2 rounded">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default AssessmentPage;
