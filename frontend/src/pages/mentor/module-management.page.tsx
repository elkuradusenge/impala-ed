import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCourseById } from '../../hooks/use-courses.hook';
import { useModulesByCourse, useCreateModule } from '../../hooks/use-lessons.hook';
import * as moduleService from '../../services/module.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faBookOpen, faArrowLeft, faLayerGroup, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const ModuleManagementPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course } = useCourseById(courseId!);
  const { data: modules, isLoading, refetch } = useModulesByCourse(courseId!);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await moduleService.updateModule(editing, formData);
        toast.success('Module updated');
      } else {
        await moduleService.createModule({ ...formData, courseId: courseId! });
        toast.success('Module created');
      }
      setShowForm(false); setEditing(null);
      setFormData({ title: '', description: '' });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save module');
    }
  };

  const handleEdit = (mod: any) => {
    setEditing(mod.id || mod._id);
    setFormData({ title: mod.title, description: mod.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this module and all its lessons?')) {
      try { await moduleService.deleteModule(id); refetch(); toast.success('Module deleted'); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <Link to="/mentor/courses" className="text-sm text-impala-brown hover:text-impala-brown-dark mb-2 inline-flex items-center space-x-1">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /><span>Back to Courses</span>
        </Link>
        <h1 className="text-2xl font-bold font-display text-impala-charcoal">{course?.title} - Modules</h1>
        <p className="text-impala-charcoal-muted">Organize your course content into modules</p>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => { setEditing(null); setFormData({ title: '', description: '' }); setShowForm(!showForm); }} className="btn-primary">
          <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-1" /> {showForm ? 'Cancel' : 'Add Module'}
        </button>
      </div>

      {showForm && (
        <div className="card-white mb-6">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">{editing ? 'Edit Module' : 'New Module'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
            </div>
            <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {(!modules || modules.length === 0) ? (
          <div className="card-white text-center py-12 text-impala-charcoal-muted">
            <FontAwesomeIcon icon={faLayerGroup} className="text-4xl mb-4 opacity-50" />
            <p>No modules yet. Add your first module!</p>
          </div>
        ) : (
          modules.map((mod: any, idx: number) => (
            <div key={mod.id || mod._id} className="card-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-impala-charcoal">Module {idx + 1}: {mod.title}</h3>
                  {mod.description && <p className="text-sm text-impala-charcoal-muted">{mod.description}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/mentor/modules/${mod.id || mod._id}/lessons`} className="text-sm text-impala-brown hover:text-impala-brown-dark">
                    <FontAwesomeIcon icon={faBookOpen} className="mr-1" />Lessons ({mod.lessons?.length || 0})
                  </Link>
                  <button onClick={() => handleEdit(mod)} className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(mod.id || mod._id)} className="text-sm text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleManagementPage;
