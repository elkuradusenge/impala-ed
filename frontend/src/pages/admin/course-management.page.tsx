import { useMemo } from 'react';
import { toast } from 'sonner';
import { useCourses, useApproveCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/use-courses.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar, faArchive, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const AdminCourseManagementPage: React.FC = () => {
  const emptyParams = useMemo(() => ({}), []);
  const { data: courses, isLoading } = useCourses(emptyParams);
  const approveMutation = useApproveCourse();
  const updateMutation = useUpdateCourse();
  const archiveMutation = useDeleteCourse();

  const handleApprove = async (id: string) => { try { await approveMutation.mutateAsync(id); toast.success('Course approved'); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to approve'); } };
  const handleToggleFeatured = async (id: string, current: boolean) => { try { await updateMutation.mutateAsync({ id, data: { isFeatured: !current } }); toast.success(current ? 'Unfeatured' : 'Featured'); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update'); } };
  const handleArchive = async (id: string) => { if (window.confirm('Archive this course?')) { try { await archiveMutation.mutateAsync(id); toast.success('Course archived'); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to archive'); } } };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Course Management</h1>
      <p className="text-impala-charcoal-muted mb-6">Approve, feature, and manage courses</p>

      <div className="card-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-impala-sand">
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Title</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Mentor</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Approved</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Enrollments</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(courses || []).map((course: any) => (
              <tr key={course.id || course._id} className="border-b border-impala-sand/50 hover:bg-impala-sand">
                <td className="py-3 px-4 text-sm font-medium text-impala-charcoal">{course.title}</td>
                <td className="py-3 px-4 text-sm text-impala-charcoal-muted">{course.mentor?.name}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    course.isArchived ? 'bg-red-100 text-red-600' : course.isPublished ? 'badge-green' : 'badge-sand'
                  }`}>
                    {course.isArchived ? 'Archived' : course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4">{course.isApproved ? <span className="badge-green"><FontAwesomeIcon icon={faCheckCircle} className="mr-1" />Yes</span> : <span className="badge-sand">Pending</span>}</td>
                <td className="py-3 px-4 text-sm">{course.enrollmentCount || 0}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {!course.isApproved && (
                      <button onClick={() => handleApprove(course.id || course._id)} className="text-xs text-impala-green hover:text-impala-green-dark">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />Approve
                      </button>
                    )}
                    <button onClick={() => handleToggleFeatured(course.id || course._id, course.isFeatured)}
                      className={`text-xs ${course.isFeatured ? 'text-yellow-600' : 'text-impala-charcoal-muted hover:text-impala-charcoal'}`}>
                      <FontAwesomeIcon icon={faStar} className="mr-1" />{course.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    {!course.isArchived && (
                      <button onClick={() => handleArchive(course.id || course._id)} className="text-xs text-red-500 hover:text-red-700">
                        <FontAwesomeIcon icon={faArchive} className="mr-1" />Archive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!courses || courses.length === 0) && <p className="text-center py-8 text-impala-charcoal-muted">No courses found.</p>}
      </div>
    </div>
  );
};

export default AdminCourseManagementPage;
