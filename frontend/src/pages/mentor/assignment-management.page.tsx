import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses } from '../../hooks/use-courses.hook';
import { useAssignmentsByCourse, useCreateAssignment, useUpdateAssignment, useTogglePublishAssignment } from '../../hooks/use-assignments.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSave, faTimes, faEye, faEyeSlash, faTrash, faQuestionCircle, faListCheck } from '@fortawesome/free-solid-svg-icons';

interface QForm { questionText: string; questionType: string; points: number; explanation: string; options: { optionText: string; isCorrect: boolean }[]; }

const AssessmentManagementPage: React.FC = () => {
  const { user } = useAuth();
  const cp = useMemo(() => ({ mentor: user?.id || '' }), [user?.id]);
  const { data: courses } = useCourses(cp);
  const [selectedCourse, setSelectedCourse] = useState('');
  const { data: assignments, isLoading } = useAssignmentsByCourse(selectedCourse);
  const createMut = useCreateAssignment();
  const updateMut = useUpdateAssignment();
  const pubMut = useTogglePublishAssignment();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', passingScore: 50, timeLimit: '', dueDate: '', maxAttempts: 1, shuffleQuestions: false, shuffleOptions: false, showCorrectAnswers: true, showExplanations: true });
  const [questions, setQuestions] = useState<QForm[]>(() => mkQuestion());

  function mkQuestion(): QForm[] { return [{ questionText: '', questionType: 'text', points: 5, explanation: '', options: [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }] }]; }

  const reset = () => {
    setForm({ title: '', description: '', passingScore: 50, timeLimit: '', dueDate: '', maxAttempts: 1, shuffleQuestions: false, shuffleOptions: false, showCorrectAnswers: true, showExplanations: true });
    setQuestions(mkQuestion());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form, courseId: selectedCourse,
        timeLimit: form.timeLimit ? parseInt(form.timeLimit) : undefined,
        dueDate: form.dueDate || undefined,
        questions: questions.filter(q => q.questionText.trim()).map((q, i) => ({
          ...q,
          orderIndex: i,
          options: q.questionType === 'multiple_choice' ? q.options.filter(o => o.optionText.trim()) : undefined,
        })),
      };
      if (editing) { await updateMut.mutateAsync({ id: editing, data: payload }); toast.success('Assessment updated'); }
      else { await createMut.mutateAsync(payload); toast.success('Assessment created'); }
      setShowForm(false); setEditing(null); reset();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleEdit = (a: any) => {
    setEditing(a.id);
    setForm({ title: a.title, description: a.description || '', passingScore: a.passingScore, timeLimit: a.timeLimit?.toString() || '', dueDate: a.dueDate?.split('T')[0] || '', maxAttempts: a.maxAttempts, shuffleQuestions: a.shuffleQuestions, shuffleOptions: a.shuffleOptions, showCorrectAnswers: a.showCorrectAnswers, showExplanations: a.showExplanations });
    setQuestions((a.questions || []).map((q: any) => ({
      questionText: q.questionText, questionType: q.questionType || 'text', points: q.points, explanation: q.explanation || '',
      options: (q.options || []).map((o: any) => ({ optionText: o.optionText, isCorrect: o.isCorrect })),
    })));
    setShowForm(true);
  };

  const addQ = () => setQuestions([...questions, { questionText: '', questionType: 'text', points: 5, explanation: '', options: [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }] }]);
  const rmQ = (i: number) => setQuestions(questions.filter((_, j) => j !== i));
  const updQ = (i: number, f: string, v: any) => { const u = [...questions]; (u[i] as any)[f] = v; setQuestions(u); };
  const addOpt = (qi: number) => { const u = [...questions]; u[qi].options.push({ optionText: '', isCorrect: false }); setQuestions(u); };
  const updOpt = (qi: number, oi: number, f: string, v: any) => {
    const u = [...questions];
    (u[qi].options[oi] as any)[f] = v;
    if (f === 'isCorrect' && v && u[qi].questionType === 'multiple_choice') u[qi].options.forEach((o, j) => { if (j !== oi) o.isCorrect = false; });
    setQuestions(u);
  };
  const rmOpt = (qi: number, oi: number) => { const u = [...questions]; u[qi].options = u[qi].options.filter((_, j) => j !== oi); setQuestions(u); };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Assessment Management</h1>
      <p className="text-impala-charcoal-muted mb-6">Create assessments with text or multiple-choice questions</p>

      <div className="card-white mb-6">
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="input-field max-w-md">
          <option value="">Select a course...</option>
          {(courses || []).map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }} className="btn-primary">
              <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-1" /> {showForm ? 'Cancel' : 'New Assessment'}
            </button>
          </div>

          {showForm && (
            <div className="card-white mb-6">
              <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">{editing ? 'Edit Assessment' : 'New Assessment'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
                  <div><label className="block text-sm font-medium mb-1">Passing Score (%)</label><input type="number" min={0} max={100} value={form.passingScore} onChange={e => setForm({ ...form, passingScore: +e.target.value || 0 })} className="input-field" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Time Limit (min)</label><input type="number" min={0} value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1">Max Attempts</label><input type="number" min={1} value={form.maxAttempts} onChange={e => setForm({ ...form, maxAttempts: +e.target.value || 1 })} className="input-field" /></div>
                </div>
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <label className="flex items-center space-x-2"><input type="checkbox" checked={form.shuffleQuestions} onChange={e => setForm({ ...form, shuffleQuestions: e.target.checked })} /><span>Shuffle Questions</span></label>
                  <label className="flex items-center space-x-2"><input type="checkbox" checked={form.shuffleOptions} onChange={e => setForm({ ...form, shuffleOptions: e.target.checked })} /><span>Shuffle Options</span></label>
                  <label className="flex items-center space-x-2"><input type="checkbox" checked={form.showCorrectAnswers} onChange={e => setForm({ ...form, showCorrectAnswers: e.target.checked })} /><span>Show Correct Answers</span></label>
                  <label className="flex items-center space-x-2"><input type="checkbox" checked={form.showExplanations} onChange={e => setForm({ ...form, showExplanations: e.target.checked })} /><span>Show Explanations</span></label>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold"><FontAwesomeIcon icon={faQuestionCircle} className="mr-1 text-impala-brown" /> Questions ({questions.length})</h3>
                    <button type="button" onClick={addQ} className="text-sm text-impala-brown">+ Add Question</button>
                  </div>
                  {questions.map((q, qi) => (
                    <div key={qi} className="border rounded-lg p-4 mb-3 bg-impala-ivory">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-sm">Question {qi + 1}</h4>
                        <button type="button" onClick={() => rmQ(qi)} className="text-red-500 text-sm"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                      <div className="space-y-3">
                        <input type="text" value={q.questionText} onChange={e => updQ(qi, 'questionText', e.target.value)} className="input-field" placeholder="Enter question text..." required />
                        <div className="grid md:grid-cols-3 gap-3">
                          <div><label className="text-xs text-impala-charcoal-muted">Type</label>
                            <select value={q.questionType} onChange={e => updQ(qi, 'questionType', e.target.value)} className="input-field text-sm">
                              <option value="text">Text Answer</option>
                              <option value="multiple_choice">Multiple Choice</option>
                            </select></div>
                          <div><label className="text-xs text-impala-charcoal-muted">Points</label><input type="number" min={1} value={q.points} onChange={e => updQ(qi, 'points', +e.target.value || 1)} className="input-field text-sm" /></div>
                          <div><label className="text-xs text-impala-charcoal-muted">Explanation</label><input type="text" value={q.explanation} onChange={e => updQ(qi, 'explanation', e.target.value)} className="input-field text-sm" /></div>
                        </div>
                        {q.questionType === 'multiple_choice' && (
                          <div>
                            <div className="flex justify-between items-center mb-1"><span className="text-xs text-impala-charcoal-muted">Choices</span><button type="button" onClick={() => addOpt(qi)} className="text-xs text-impala-brown">+ Add Choice</button></div>
                            {q.options.map((o, oi) => (
                              <div key={oi} className="flex items-center gap-2 mb-1">
                                <input type="radio" name={`mc-${qi}`} checked={o.isCorrect} onChange={e => updOpt(qi, oi, 'isCorrect', e.target.checked)} className="shrink-0" />
                                <input type="text" value={o.optionText} onChange={e => updOpt(qi, oi, 'optionText', e.target.value)} className="input-field text-sm flex-1" placeholder={`Choice ${oi + 1}`} />
                                {q.options.length > 2 && <button type="button" onClick={() => rmOpt(qi, oi)} className="text-red-400 text-xs"><FontAwesomeIcon icon={faTimes} /></button>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update' : 'Create'}</button>
              </form>
            </div>
          )}

          <div className="card-white">
            <h2 className="text-lg font-semibold mb-4"><FontAwesomeIcon icon={faListCheck} className="mr-2 text-impala-brown" /> Assessments</h2>
            {(!assignments || assignments.length === 0) ? (
              <p className="text-center py-4 text-impala-charcoal-muted">No assessments yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((a: any) => (
                  <div key={a.id} className="border rounded-lg p-4 bg-impala-ivory">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{a.title}</h3>
                          {a.isPublished ? <span className="badge-green">Published</span> : <span className="badge-sand">Draft</span>}
                        </div>
                        <p className="text-xs text-impala-charcoal-muted mt-1">{a.questions?.length || 0} questions | {a.totalPoints} pts | Pass: {a.passingScore}%</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => pubMut.mutate({ id: a.id, isPublished: !a.isPublished })} className={`text-sm ${a.isPublished ? 'text-amber-600' : 'text-impala-green'} hover:opacity-80`}>
                          <FontAwesomeIcon icon={a.isPublished ? faEyeSlash : faEye} className="mr-1" />{a.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleEdit(a)} className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal"><FontAwesomeIcon icon={faEdit} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentManagementPage;
