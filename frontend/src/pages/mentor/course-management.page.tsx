import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, useCategories } from '../../hooks/use-courses.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faArchive, faBookOpen, faLayerGroup, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

const CourseManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses({ mentor: user?.id || '' });
  const { data: categories } = useCategories();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '', description: '', shortDescription: '', difficultyLevel: 'beginner', duration: '', category: '', learningObjectives: [''],
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', shortDescription: '', difficultyLevel: 'beginner', duration: '', category: '', learningObjectives: [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, learningObjectives: formData.learningObjectives.filter((o: string) => o.trim()) };
      if (editing) {
        await updateMutation.mutateAsync({ id: editing, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (_) {}
  };

  const handleEdit = (course: any) => {
    setEditing(course.id || course._id);
    setFormData({
      title: course.title, description: course.description, shortDescription: course.shortDescription || '',
      difficultyLevel: course.difficultyLevel, duration: course.duration || '',
      category: course.category?.id || course.category?._id || '',
      learningObjectives: course.learningObjectives?.length ? course.learningObjectives : [''],
    });
    setShowForm(true);
  };

  const handleArchive = async (id: string) => {
    if (window.confirm('Archive this course?')) {
      try { await deleteMutation.mutateAsync(id); } catch (_) {}
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-impala-charcoal">Course Management</h1>
          <p className="text-impala-charcoal-muted">Create and manage your courses</p>
        </div>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(!showForm); }} className="btn-primary">
          <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-1" /> {showForm ? 'Cancel' : 'New Course'}
        </button>
      </div>

      {showForm && (
        <div className="card-white mb-8">
          <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">{editing ? 'Edit Course' : 'Create New Course'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">Difficulty</label>
                <select value={formData.difficultyLevel} onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })} className="input-field">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Short Description</label>
              <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Description *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={4} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">Duration</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input-field" placeholder="e.g., 6 weeks" />
              </div>
              <div>
                <label className="block text-sm font-medium text-impala-charcoal mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                  <option value="">Select category</option>
                  {(categories || []).map((cat: any) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-2">Learning Objectives</label>
              {formData.learningObjectives.map((obj: string, idx: number) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={obj} onChange={(e) => {
                    const lo = [...formData.learningObjectives]; lo[idx] = e.target.value;
                    setFormData({ ...formData, learningObjectives: lo });
                  }} className="input-field" placeholder={`Objective ${idx + 1}`} />
                  <button type="button" onClick={() => {
                    const lo = formData.learningObjectives.filter((_: any, i: number) => i !== idx);
                    setFormData({ ...formData, learningObjectives: lo });
                  }} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTimes} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, learningObjectives: [...formData.learningObjectives, ''] })}
                className="text-sm text-impala-brown hover:text-impala-brown-dark">+ Add Objective</button>
            </div>
            <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update Course' : 'Create Course'}</button>
          </form>
        </div>
      )}

      <div className="card-white">
        {(!courses || courses.length === 0) ? (
          <p className="text-center text-impala-charcoal-muted py-8">No courses created yet.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course: any) => (
              <div key={course.id || course._id} className="border border-impala-sand rounded-lg p-4 flex items-center justify-between bg-impala-ivory">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-impala-charcoal">{course.title}</h3>
                    {course.isPublished ? <span className="badge-green">Published</span> : <span className="badge-sand">Draft</span>}
                    {course.isApproved && <span className="badge-brown">Approved</span>}
                  </div>
                  <p className="text-sm text-impala-charcoal-muted mt-1">{course.difficultyLevel} | {course.enrollmentCount || 0} students</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/mentor/courses/${course.id || course._id}/modules`} className="text-sm text-impala-brown hover:text-impala-brown-dark">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-1" />Modules
                  </Link>
                  <button onClick={() => handleEdit(course)} className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleArchive(course.id || course._id)} className="text-sm text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faArchive} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagementPage;
