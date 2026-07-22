import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModuleById } from '../../hooks/use-module.hook';
import { useLessonsByModule, useCreateLesson } from '../../hooks/use-lessons.hook';
import * as lessonService from '../../services/lesson.service';
import * as pdfService from '../../services/pdf.service';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faFilePdf, faArrowLeft, faSave, faTimes, faClock } from '@fortawesome/free-solid-svg-icons';

const LessonManagementPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { data: mod, isLoading: modLoading } = useModuleById(moduleId!);
  const { data: lessons, isLoading: lessonsLoading, refetch } = useLessonsByModule(moduleId!);
  const { data: pdfs } = useQuery({ queryKey: ['pdfs'], queryFn: () => pdfService.getPDFs() });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', pdfDocument: '', duration: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
              const courseId = mod?.courseId || '';
      const data = { ...formData, module: moduleId || '', course: courseId, pdfDocument: formData.pdfDocument || undefined };
      if (editing) {
        await lessonService.updateLesson(editing, data);
      } else {
        await lessonService.createLesson(data as any);
      }
      setShowForm(false); setEditing(null);
      setFormData({ title: '', description: '', pdfDocument: '', duration: '' });
      refetch();
    } catch (_) {}
  };

  const handleEdit = (lesson: any) => {
    setEditing(lesson.id || lesson._id);
    setFormData({
      title: lesson.title, description: lesson.description || '',
      pdfDocument: lesson.pdfDocument?.id || lesson.pdfDocument?._id || '', duration: lesson.duration || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this lesson?')) {
      try { await lessonService.deleteLesson(id); refetch(); } catch (_) {}
    }
  };

  if (modLoading || lessonsLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <Link to={`/mentor/courses/${mod?.courseId}/modules`} className="text-sm text-impala-brown hover:text-impala-brown-dark mb-2 inline-flex items-center space-x-1">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /><span>Back to Modules</span>
        </Link>
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">{mod?.title} - Lessons</h1>
        <p className="text-impala-charcoal-muted">Add and organize lessons</p>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => { setEditing(null); setFormData({ title: '', description: '', pdfDocument: '', duration: '' }); setShowForm(!showForm); }} className="btn-primary">
          <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-1" /> {showForm ? 'Cancel' : 'Add Lesson'}
        </button>
      </div>

      {showForm && (
        <div className="card-white mb-6">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">{editing ? 'Edit Lesson' : 'New Lesson'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">PDF Document</label>
                <select value={formData.pdfDocument} onChange={(e) => setFormData({ ...formData, pdfDocument: e.target.value })} className="input-field">
                  <option value="">No PDF</option>
                  {(pdfs || []).map((pdf: any) => (
                    <option key={pdf.id || pdf._id} value={pdf.id || pdf._id}>{pdf.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">Duration</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input-field" placeholder="e.g., 30 min" />
              </div>
            </div>
            <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {(!lessons || lessons.length === 0) ? (
          <div className="card-white text-center py-12 text-impala-charcoal-muted">
            <FontAwesomeIcon icon={faFilePdf} className="text-4xl mb-4 opacity-50" />
            <p>No lessons yet. Add your first lesson!</p>
          </div>
        ) : (
          lessons.map((lesson: any, idx: number) => (
            <div key={lesson.id || lesson._id} className="card-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-impala-charcoal">Lesson {idx + 1}: {lesson.title}</h3>
                    {lesson.pdfDocument && <span className="badge-brown"><FontAwesomeIcon icon={faFilePdf} className="mr-1" />PDF</span>}
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-impala-charcoal-muted">
                    {lesson.duration && <span><FontAwesomeIcon icon={faClock} className="mr-1" />{lesson.duration}</span>}
                    {lesson.pdfDocument && <span>{lesson.pdfDocument.originalName || lesson.pdfDocument.fileName}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(lesson)} className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(lesson.id || lesson._id)} className="text-sm text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonManagementPage;
