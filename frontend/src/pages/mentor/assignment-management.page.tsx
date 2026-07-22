import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses } from '../../hooks/use-courses.hook';
import { useAssignmentsByCourse, useAllSubmissions, useReviewSubmission } from '../../hooks/use-assignments.hook';
import * as assignmentService from '../../services/assignment.service';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faExternalLinkAlt, faSave, faTimes, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const AssignmentManagementPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: courses } = useCourses({ mentor: user?.id || '' });
  const [selectedCourse, setSelectedCourse] = useState('');
  const { data: assignments, isLoading: asstLoading } = useAssignmentsByCourse(selectedCourse);
  const { data: submissions, isLoading: subLoading } = useAllSubmissions(selectedCourse);
  const reviewMutation = useReviewSubmission();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', instructions: '', googleDocsLink: '', dueDate: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, courseId: selectedCourse };
      if (editing) {
        await assignmentService.updateAssignment(editing, data);
      } else {
        await assignmentService.createAssignment(data as any);
      }
      setShowForm(false); setEditing(null);
      setFormData({ title: '', description: '', instructions: '', googleDocsLink: '', dueDate: '' });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    } catch (_) {}
  };

  const handleEdit = (asst: any) => {
    setEditing(asst.id || asst._id);
    setFormData({
      title: asst.title, description: asst.description || '', instructions: asst.instructions,
      googleDocsLink: asst.googleDocsLink || '', dueDate: asst.dueDate ? asst.dueDate.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleReview = async (submissionId: string) => {
    try { await reviewMutation.mutateAsync({ id: submissionId, data: { status: 'reviewed' } }); } catch (_) {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Assignment Management</h1>
      <p className="text-impala-charcoal-muted mb-6">Create assignments and review submissions</p>

      <div className="card-white mb-6">
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="input-field max-w-md">
          <option value="">Select a course...</option>
          {(courses || []).map((c: any) => (
            <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditing(null); setFormData({ title: '', description: '', instructions: '', googleDocsLink: '', dueDate: '' }); setShowForm(!showForm); }} className="btn-primary">
              <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-1" /> {showForm ? 'Cancel' : 'New Assignment'}
            </button>
          </div>

          {showForm && (
            <div className="card-white mb-6">
              <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">{editing ? 'Edit Assignment' : 'New Assignment'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-impala-charcoal mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-impala-charcoal mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-impala-charcoal mb-1">Instructions *</label>
                  <textarea value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} className="input-field" rows={4} required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-impala-charcoal mb-1">Google Docs Link</label>
                    <input type="url" value={formData.googleDocsLink} onChange={(e) => setFormData({ ...formData, googleDocsLink: e.target.value })} className="input-field" placeholder="https://docs.google.com/document/d/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-impala-charcoal mb-1">Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="input-field" />
                  </div>
                </div>
                <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update' : 'Create'}</button>
              </form>
            </div>
          )}

          <div className="card-white mb-6">
            <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">Assignments</h2>
            {(!assignments || assignments.length === 0) ? (
              <p className="text-impala-charcoal-muted text-center py-4">No assignments yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((asst: any) => (
                  <div key={asst.id || asst._id} className="border border-impala-sand rounded-lg p-4 bg-impala-ivory">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-impala-charcoal">{asst.title}</h3>
                        <p className="text-sm text-impala-charcoal-muted">{asst.googleDocsLink ? '📄 Google Docs linked' : 'No document link'}</p>
                      </div>
                      <button onClick={() => handleEdit(asst)} className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal"><FontAwesomeIcon icon={faEdit} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-white">
            <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
              <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-impala-brown" />
              Submissions ({submissions?.length || 0})
            </h2>
            {(!submissions || submissions.length === 0) ? (
              <p className="text-impala-charcoal-muted text-center py-4">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub: any) => (
                  <div key={sub.id || sub._id} className="border border-impala-sand rounded-lg p-4 bg-impala-ivory">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-impala-charcoal">{sub.student?.name}</p>
                        <p className="text-xs text-impala-charcoal-muted">{sub.assignment?.title}</p>
                        {sub.submittedLink && (
                          <a href={sub.submittedLink} target="_blank" rel="noopener noreferrer" className="text-xs text-impala-brown hover:underline">
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1" />View submitted doc
                          </a>
                        )}
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            sub.status === 'reviewed' ? 'badge-green' : sub.status === 'submitted' ? 'badge-brown' : 'badge-sand'
                          }`}>{sub.status}</span>
                        </div>
                      </div>
                      {sub.status === 'submitted' && (
                        <button onClick={() => handleReview(sub.id || sub._id)} className="btn-primary text-sm">Mark Reviewed</button>
                      )}
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

export default AssignmentManagementPage;
