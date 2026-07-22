import { useState } from 'react';
import { useUsers } from '../../hooks/use-users.hook';
import * as userService from '../../services/user.service';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faToggleOn, faToggleOff, faKey, faUsers, faFilter } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/format.utils';

const UserManagementPage: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useUsers({ ...(filter ? { role: filter } : {}), ...(search ? { search } : {}) });

  const handleToggleActive = async (userId: string, current: boolean) => {
    try { await userService.updateUser(userId, { isActive: !current } as any); queryClient.invalidateQueries({ queryKey: ['users'] }); } catch (_) {}
  };

  const handleResetPassword = async (userId: string) => {
    const pwd = prompt('Enter new password:');
    if (pwd && pwd.length >= 6) {
      try { await userService.resetUserPassword(userId, pwd); alert('Password reset successfully'); } catch (_) { alert('Failed'); }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">User Management</h1>
      <p className="text-impala-charcoal-muted mb-6">Manage all platform users</p>

      <div className="card-white mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-40">
            <option value="">All Roles</option><option value="student">Students</option><option value="mentor">Mentors</option><option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="card-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-impala-sand">
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Joined</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-impala-charcoal-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u: any) => (
              <tr key={u.id || u._id} className="border-b border-impala-sand/50 hover:bg-impala-sand">
                <td className="py-3 px-4 text-sm text-impala-charcoal">{u.name}</td>
                <td className="py-3 px-4 text-sm text-impala-charcoal-muted">{u.email}</td>
                <td className="py-3 px-4"><span className="badge-brown capitalize">{u.role}</span></td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'badge-green' : 'bg-red-100 text-red-600'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-impala-charcoal-muted">{formatDate(u.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleToggleActive(u.id || u._id, u.isActive)}
                      className={`text-xs ${u.isActive ? 'text-red-500 hover:text-red-700' : 'text-impala-green hover:text-impala-green-dark'}`}>
                      <FontAwesomeIcon icon={u.isActive ? faToggleOn : faToggleOff} className="mr-1" />
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleResetPassword(u.id || u._id)} className="text-xs text-impala-brown hover:text-impala-brown-dark">
                      <FontAwesomeIcon icon={faKey} className="mr-1" />Reset Pwd
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && <p className="text-center py-8 text-impala-charcoal-muted">No users found.</p>}
      </div>
    </div>
  );
};

export default UserManagementPage;
