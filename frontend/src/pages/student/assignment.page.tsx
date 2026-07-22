import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAssignmentsByCourse, useSubmissionByAssignment, useSubmitAssignment } from '../../hooks/use-assignments.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faExternalLinkAlt, faCheckCircle, faClock, faPaperPlane, faComments } from '@fortawesome/free-solid-svg-icons';

const AssignmentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: assignments, isLoading: asstLoading } = useAssignmentsByCourse(courseId!);
  const assignment = assignments?.[0];
  const assignmentId = assignment?.id || '';
  const { data: submission, isLoading: subLoading } = useSubmissionByAssignment(assignmentId);
  const submitMutation = useSubmitAssignment();
  const [submittedLink, setSubmittedLink] = useState(submission?.submittedLink || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    setMessage('');
    try {
      await submitMutation.mutateAsync({ id: assignment.id, link: submittedLink });
      setMessage('Assignment submitted successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Submission failed');
    }
  };

  if (asstLoading || subLoading) return <LoadingSpinner />;
  if (!assignment) {
    return (
      <div className="text-center py-20">
        <FontAwesomeIcon icon={faFileAlt} className="text-4xl mb-4 text-impala-charcoal-muted opacity-50" />
        <p className="text-impala-charcoal-muted">No assignment available for this course yet.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'badge-sand', submitted: 'badge-brown', reviewed: 'badge-green',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-impala-charcoal">{assignment.title}</h1>
            {submission && (
              <span className={`inline-block mt-2 ${statusColors[submission.status] || 'badge-sand'}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-impala-charcoal mb-2 font-display">Instructions</h3>
          <p className="text-impala-charcoal whitespace-pre-wrap leading-relaxed">{assignment.instructions}</p>
        </div>

        {assignment.description && <p className="text-impala-charcoal-muted mb-4">{assignment.description}</p>}

        {assignment.googleDocsLink && (
          <div className="mb-6">
            <h3 className="font-semibold text-impala-charcoal mb-2 font-display">Assignment Document</h3>
            <a href={assignment.googleDocsLink} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center space-x-2">
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Open in Google Docs</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
            </a>
          </div>
        )}
      </div>

      <div className="card-white">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          {submission?.status === 'submitted' || submission?.status === 'reviewed' ? 'Update Submission' : 'Submit Assignment'}
        </h2>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-impala-green/10 text-impala-green' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Google Docs Link</label>
            <input type="url" value={submittedLink} onChange={(e) => setSubmittedLink(e.target.value)} className="input-field" placeholder="https://docs.google.com/document/d/..." required />
            <p className="text-xs text-impala-charcoal-muted mt-1">Paste the link to your completed Google Docs assignment</p>
          </div>
          <button type="submit" disabled={submitMutation.isPending} className="btn-primary inline-flex items-center space-x-2">
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{submitMutation.isPending ? 'Submitting...' : submission ? 'Update Submission' : 'Submit Assignment'}</span>
          </button>
        </form>

        {submission?.mentorFeedback && (
          <div className="mt-6 p-4 bg-impala-sand rounded-lg">
            <h4 className="font-medium text-sm text-impala-charcoal mb-1">
              <FontAwesomeIcon icon={faComments} className="mr-1" /> Mentor Feedback
            </h4>
            <p className="text-impala-charcoal-muted text-sm">{submission.mentorFeedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
