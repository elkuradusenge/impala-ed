import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth.hook';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, useCategories } from '../../hooks/use-courses.hook';
import { uploadPDF as uploadPDFService } from '../../services/pdf.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faArchive, faBookOpen, faLayerGroup, faTimes, faSave, faFilePdf, faUpload, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CourseManagementPage: React.FC = () => {
  const { user } = useAuth();
  const courseParams = useMemo(() => ({ mentor: user?.id || '' }), [user?.id]);
  const { data: courses, isLoading } = useCourses(courseParams);
  const { data: categories } = useCategories();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({
    title: '', description: '', shortDescription: '', difficultyLevel: 'beginner', duration: '', categoryId: '', learningObjectives: [''],
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', shortDescription: '', difficultyLevel: 'beginner', duration: '', categoryId: '', learningObjectives: [''] });
    setPdfFile(null);
    setPdfError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are allowed');
      setPdfFile(null);
      return;
    }
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setPdfError('File size must be less than 50MB');
      setPdfFile(null);
      return;
    }
    setPdfFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, learningObjectives: formData.learningObjectives.filter((o: string) => o.trim()) };
      let courseId: string;

      if (editing) {
        const result = await updateMutation.mutateAsync({ id: editing, data });
        courseId = editing;
        toast.success('Course updated successfully');
      } else {
        const result = await createMutation.mutateAsync(data);
        courseId = result.id;
        toast.success('Course created successfully');
      }

      // Upload PDF if selected
      if (pdfFile && courseId) {
        setUploadingPdf(true);
        try {
          const fd = new FormData();
          fd.append('pdf', pdfFile);
          fd.append('title', pdfFile.name);
          fd.append('courseId', courseId);
          await uploadPDFService(fd);
          toast.success('Course material uploaded successfully');
        } catch (_) {
          const msg = 'Failed to upload course material. You can upload it later.';
          setPdfError(msg);
          toast.error(msg);
        } finally {
          setUploadingPdf(false);
        }
      }

      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course: any) => {
    setEditing(course.id || course._id);
    setFormData({
      title: course.title, description: course.description, shortDescription: course.shortDescription || '',
      difficultyLevel: course.difficultyLevel, duration: course.duration || '',
      categoryId: course.category?.id || course.category?._id || '',
      learningObjectives: course.learningObjectives?.length ? course.learningObjectives : [''],
    });
    setShowForm(true);
  };

  const handleArchive = async (id: string) => {
    if (window.confirm('Archive this course?')) {
      try { await deleteMutation.mutateAsync(id); toast.success('Course archived'); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to archive'); }
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { isPublished: !current } });
      toast.success(current ? 'Course unpublished' : 'Course published');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update publish status');
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
                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="input-field">
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

            {/* PDF Upload field */}
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-2">
                <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
                Course Material (PDF)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-outline text-sm inline-flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <span>{pdfFile ? pdfFile.name : 'Choose PDF file'}</span>
                </button>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={() => { setPdfFile(null); setPdfError(''); }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
              {pdfError && (
                <p className="text-red-500 text-xs mt-1">{pdfError}</p>
              )}
              <p className="text-xs text-impala-charcoal-muted mt-1">
                Upload a PDF document (max 50MB) to share with enrolled students.
              </p>
            </div>

            <button type="submit" disabled={uploadingPdf} className="btn-primary">
              {uploadingPdf ? (
                <><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> Uploading...</>
              ) : (
                <><FontAwesomeIcon icon={faSave} className="mr-1" /> {editing ? 'Update Course' : 'Create Course'}</>
              )}
            </button>
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
                    {course.courseMaterials && course.courseMaterials.length > 0 && (
                      <span className="text-xs text-impala-charcoal-muted">
                        <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
                        {course.courseMaterials.length} PDF(s)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-impala-charcoal-muted mt-1">{course.difficultyLevel} | {course.enrollmentCount || 0} students</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/mentor/courses/${course.id || course._id}/modules`} className="text-sm text-impala-brown hover:text-impala-brown-dark">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-1" />Modules
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(course.id || course._id, course.isPublished)}
                    className={`text-sm ${course.isPublished ? 'text-amber-600 hover:text-amber-800' : 'text-impala-green hover:text-impala-green-dark'}`}
                    title={course.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    <FontAwesomeIcon icon={course.isPublished ? faEye : faEyeSlash} className="mr-1" />
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
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
