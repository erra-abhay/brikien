'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: 'profile' | 'project' | 'blog' | 'content';
}

export default function ImageUpload({ value, onChange, category = 'content' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      const formData = new FormData();
      formData.append('image', file);

      const res: any = await api.post(`/upload/image?category=${category}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });

      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.toString() || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [category, onChange]);

  const removeImage = async () => {
    try {
      if (value) {
        await api.delete('/upload/image', { data: { url: value } });
        onChange('');
        toast.success('Image removed');
      }
    } catch (error: any) {
      toast.error('Failed to remove image');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
        'image/gif': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <Image src={getImageUrl(value)} alt="Upload preview" fill className="object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-black'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive ? "Drop the image here" : "Drag 'n' drop an image here, or click to select"}
          </p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP up to 10MB</p>
          
          {uploading && (
            <div className="w-full max-w-xs mt-4">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1">{progress}% uploaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
