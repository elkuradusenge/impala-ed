import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faInfoCircle, faLock, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile({ name, bio });
      setMessage('Profile updated successfully');
      toast.success('Profile updated successfully');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Update failed';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    setPasswordMessage('');
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password changed successfully');
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password change failed';
      setPasswordMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Info */}
      <div className="card-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-impala-brown/10 rounded-full flex items-center justify-center text-2xl text-impala-brown">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-impala-charcoal">{user?.name}</h1>
            <p className="text-impala-charcoal-muted text-sm capitalize">{user?.role}</p>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-impala-green/10 text-impala-green' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">
              <FontAwesomeIcon icon={faUser} className="mr-1 text-impala-brown text-xs" /> Full Name
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">
              <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-impala-brown text-xs" /> Email
            </label>
            <input type="email" value={user?.email || ''} className="input-field bg-impala-sand" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-impala-brown text-xs" /> Bio
            </label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field" rows={3} placeholder="Tell us about yourself..." />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faSave} className="mr-1" /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card-white">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faLock} className="mr-2 text-impala-brown" /> Change Password
        </h2>
        {passwordMessage && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${passwordMessage.includes('success') ? 'bg-impala-green/10 text-impala-green' : 'bg-red-50 text-red-600'}`}>
            {passwordMessage}
          </div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="btn-primary">
            <FontAwesomeIcon icon={faLock} className="mr-1" /> Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
