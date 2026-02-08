import { useCallback, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  previews?: string[];
  onRemovePreview?: (index: number) => void;
  label?: string;
}

export function FileUpload({
  accept = 'image/*',
  multiple = false,
  onFilesSelected,
  previews = [],
  onRemovePreview,
  label = 'Upload Files',
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-accent bg-accent-muted'
            : 'border-border hover:border-border-light'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary">
            Drag & drop or <span className="text-accent">browse files</span>
          </p>
          <p className="text-xs text-text-muted mt-1">PNG, JPG, MP4 up to 50MB</p>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((url, i) => (
            <div key={i} className="relative group w-20 h-20">
              {url.includes('.mp4') || url.includes('video') ? (
                <div className="w-full h-full rounded-lg bg-card border border-border flex items-center justify-center">
                  <Image className="w-6 h-6 text-text-muted" />
                </div>
              ) : (
                <img
                  src={url}
                  alt=""
                  className="w-full h-full rounded-lg object-cover border border-border"
                />
              )}
              {onRemovePreview && (
                <button
                  onClick={() => onRemovePreview(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-status-declined text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
