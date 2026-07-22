import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as pdfService from '../../services/pdf.service';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faTrash, faExternalLinkAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { formatFileSize } from '../../utils/format.utils';

const PDFUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const { data: pdfs, isLoading } = useQuery({ queryKey: ['pdfs'], queryFn: () => pdfService.getPDFs() });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title || file.name);
      await pdfService.uploadPDF(formData);
      setMessage('PDF uploaded successfully!');
      setFile(null);
      setTitle('');
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this PDF?')) {
      try { await pdfService.deletePDF(id); queryClient.invalidateQueries({ queryKey: ['pdfs'] }); } catch (_) {}
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold font-display text-impala-charcoal mb-2">PDF Document Management</h1>
      <p className="text-impala-charcoal-muted mb-6">Upload and manage PDF learning materials</p>

      <div className="card-white mb-6">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faUpload} className="mr-2 text-impala-brown" /> Upload PDF
        </h2>
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-impala-green/10 text-impala-green' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Document Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Leave empty to use file name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">PDF File *</label>
            <input type="file" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-impala-charcoal-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-impala-brown/10 file:text-impala-brown hover:file:bg-impala-brown/20" required />
          </div>
          <button type="submit" disabled={uploading || !file} className="btn-primary">
            {uploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faUpload} className="mr-1" /> Upload PDF</>}
          </button>
        </form>
      </div>

      <div className="card-white">
        <h2 className="text-lg font-semibold font-display text-impala-charcoal mb-4">
          <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-impala-brown" /> Uploaded Documents
        </h2>
        {isLoading ? <LoadingSpinner size="sm" /> : (!pdfs || pdfs.length === 0) ? (
          <p className="text-center text-impala-charcoal-muted py-8">No PDFs uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf: any) => (
              <div key={pdf.id || pdf._id} className="flex items-center justify-between p-3 border border-impala-sand rounded-lg bg-impala-ivory">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faFilePdf} className="text-impala-brown text-xl" />
                  <div>
                    <p className="font-medium text-sm text-impala-charcoal">{pdf.title}</p>
                    <p className="text-xs text-impala-charcoal-muted">{pdf.originalName} • {formatFileSize(pdf.fileSize)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a href={pdfService.getPDFUrl(pdf.id || pdf._id)} target="_blank" rel="noopener noreferrer" className="text-sm text-impala-brown hover:text-impala-brown-dark">
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <button onClick={() => handleDelete(pdf.id || pdf._id)} className="text-sm text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
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

export default PDFUploadPage;
