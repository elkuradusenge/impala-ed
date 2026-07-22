import apiClient from './api-client.service';

export interface PdfDocument {
  id: string;
  title: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  uploadedBy?: { id: string; name: string };
  createdAt: string;
}

export const uploadPDF = async (formData: FormData): Promise<PdfDocument> => {
  const response = await apiClient.post('/pdf/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getPDFs = async (): Promise<PdfDocument[]> => {
  const response = await apiClient.get('/pdf');
  return response.data;
};

export const getPDFById = async (id: string): Promise<PdfDocument> => {
  const response = await apiClient.get(`/pdf/${id}`);
  return response.data;
};

export const getPDFUrl = (id: string): string => `/api/pdf/${id}/serve`;

export const deletePDF = async (id: string) => {
  const response = await apiClient.delete(`/pdf/${id}`);
  return response.data;
};
