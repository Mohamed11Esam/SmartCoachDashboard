import api from './axios';

interface CloudinaryPresignedResponse {
  uploadUrl: string;
  fileUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  folder: string;
}

export async function uploadFile(file: File): Promise<string> {
  // Get signed upload params from our backend
  const { data } = await api.post<CloudinaryPresignedResponse>('/media/presigned-url', {
    fileName: file.name,
    fileType: file.type,
  });

  // Upload directly to Cloudinary using signed params
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', data.apiKey);
  formData.append('timestamp', String(data.timestamp));
  formData.append('signature', data.signature);
  formData.append('public_id', data.publicId);
  formData.append('folder', data.folder);

  const res = await fetch(data.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();
  return result.secure_url;
}

export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  const urls = await Promise.all(files.map(uploadFile));
  return urls;
}
