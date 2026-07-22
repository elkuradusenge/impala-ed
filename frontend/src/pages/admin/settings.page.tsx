import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as settingsService from '../../services/settings.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCog, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';

const SettingsPage: React.FC = () => {
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: () => settingsService.getSettings() });
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.updateSetting({ key: newKey, value: newValue, description: newDescription });
      setMessage('Setting added successfully');
      setNewKey(''); setNewValue(''); setNewDescription('');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to add setting');
    }
  };

  const handleDelete = async (key: string) => {
    if (window.confirm(`Delete setting "${key}"?`)) {
      try { await settingsService.deleteSetting(key); queryClient.invalidateQueries({ queryKey: ['settings'] }); } catch (_) {}
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">Platform Settings</h1>
      <p className="text-impala-charcoal-muted mb-6">Configure platform-wide settings</p>

      <div className="card-white mb-6">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faPlus} className="mr-2 text-impala-brown" /> Add New Setting
        </h2>
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-impala-green/10 text-impala-green' : 'bg-red-50 text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Key</label>
              <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="input-field" required placeholder="setting_key" />
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Value</label>
              <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="input-field" required placeholder="Setting value" />
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Description</label>
              <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="input-field" placeholder="Optional description" />
            </div>
          </div>
          <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faSave} className="mr-1" /> Add Setting</button>
        </form>
      </div>

      <div className="card-white">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faCog} className="mr-2 text-impala-brown" /> Current Settings
        </h2>
        {!settings || Object.keys(settings).length === 0 ? (
          <p className="text-center text-impala-charcoal-muted py-8">No settings configured.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-impala-sand rounded-lg bg-impala-ivory">
                <div>
                  <p className="font-medium text-sm text-impala-charcoal">{key}</p>
                  <p className="text-sm text-impala-charcoal-muted">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                </div>
                <button onClick={() => handleDelete(key)} className="text-sm text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
