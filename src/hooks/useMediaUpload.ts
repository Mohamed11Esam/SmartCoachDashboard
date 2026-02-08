import { useState } from 'react';
import { uploadFile, uploadMultipleFiles } from '../lib/upload';
import toast from 'react-hot-toast';

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      return url;
    } catch {
      toast.error('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMany = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    try {
      const urls = await uploadMultipleFiles(files);
      return urls;
    } catch {
      toast.error('Failed to upload files');
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploadMany, uploading };
}
