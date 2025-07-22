import React, { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';

// Define file upload variants
const fileUploadVariants = cva(
  'relative flex flex-col gap-6',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const dropzoneVariants = cva(
  'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-32 px-4 py-3',
        md: 'h-40 px-6 py-4', 
        lg: 'h-48 px-8 py-5',
      },
      state: {
        default: 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50',
        active: 'border-primary-500 bg-primary-50',
        error: 'border-danger-500 bg-danger-50',
        disabled: 'border-neutral-200 bg-neutral-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

const fileItemVariants = cva(
  'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
  {
    variants: {
      state: {
        default: 'border-neutral-200 bg-white hover:border-neutral-300',
        uploading: 'border-primary-200 bg-primary-50',
        success: 'border-success-200 bg-success-50',
        error: 'border-danger-200 bg-danger-50',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// Types
export interface FileUploadFile {
  id: string;
  file: File;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export interface FileUploadProps extends VariantProps<typeof fileUploadVariants> {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  showPreview?: boolean;
  showFileList?: boolean;
  showUrlUpload?: boolean;
  uploadButtonText?: string;
  urlButtonText?: string;
  dropzoneText?: string;
  files?: FileUploadFile[];
  onFilesChange?: (files: FileUploadFile[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  onUrlUpload?: (url: string) => Promise<void>;
  className?: string;
  'aria-label'?: string;
}

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: File): string => {
  const type = file.type;
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.includes('pdf')) return 'file';
  if (type.includes('zip') || type.includes('rar')) return 'archive';
  if (type.includes('doc') || type.includes('text')) return 'document';
  return 'file';
};

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// File Item component
const FileItem: React.FC<{
  file: FileUploadFile;
  showPreview: boolean;
  onRemove?: (id: string) => void;
}> = ({ file, showPreview, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (showPreview && isImageFile(file.file) && !file.url) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file.file);
    }
    return () => {
      if (previewUrl && !file.url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, showPreview, previewUrl]);

  const displayUrl = file.url || previewUrl;

  return (
    <div className={cn(fileItemVariants({ state: file.status || 'default' }))}>
      {showPreview && isImageFile(file.file) && displayUrl ? (
        <img 
          src={displayUrl} 
          alt={file.file.name}
          className="h-12 w-12 object-cover rounded"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded bg-neutral-100">
          <Icon icon={getFileIcon(file.file)} size="sm" className="text-neutral-600" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-neutral-600">
          {formatFileSize(file.file.size)}
          {file.status === 'uploading' && file.progress !== undefined && (
            <span className="ml-2">{file.progress}%</span>
          )}
          {file.status === 'error' && file.error && (
            <span className="ml-2 text-danger-600">{file.error}</span>
          )}
        </p>
      </div>

      {file.status === 'uploading' && file.progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}

      {file.status === 'success' && (
        <Icon icon="checkCircle" size="sm" className="text-success-600" />
      )}

      {onRemove && file.status !== 'uploading' && (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="p-1 hover:bg-neutral-100 rounded transition-colors"
          aria-label={`Remove ${file.file.name}`}
        >
          <Icon icon="close" size="xs" className="text-neutral-600" />
        </button>
      )}
    </div>
  );
};

// Main FileUpload component
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    label,
    hint,
    accept = '*',
    multiple = false,
    maxSize = 10, // 10MB default
    maxFiles = 10,
    disabled = false,
    showPreview = true,
    showFileList = true,
    showUrlUpload = true,
    uploadButtonText = 'Upload file',
    urlButtonText = 'Add from URL',
    dropzoneText = 'or drag and drop',
    files = [],
    onFilesChange,
    onUpload,
    onRemove,
    onUrlUpload,
    size = 'md',
    className,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFiles = useCallback((filesToValidate: File[]): { valid: File[], errors: string[] } => {
      const valid: File[] = [];
      const errors: string[] = [];
      const maxSizeBytes = maxSize * 1024 * 1024;

      filesToValidate.forEach(file => {
        if (file.size > maxSizeBytes) {
          errors.push(`${file.name} exceeds ${maxSize}MB limit`);
        } else if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
          errors.push(`${file.name} is not an accepted file type`);
        } else {
          valid.push(file);
        }
      });

      if (!multiple && valid.length + files.length > 1) {
        return { valid: valid.slice(0, 1), errors: ['Only one file allowed'] };
      }

      if (valid.length + files.length > maxFiles) {
        const allowed = maxFiles - files.length;
        return { 
          valid: valid.slice(0, allowed), 
          errors: [`Maximum ${maxFiles} files allowed`] 
        };
      }

      return { valid, errors };
    }, [accept, maxSize, multiple, maxFiles, files.length]);

    const handleFiles = useCallback(async (newFiles: File[]) => {
      const { valid, errors } = validateFiles(newFiles);
      
      if (errors.length > 0) {
        setError(errors[0]);
        setTimeout(() => setError(null), 3000);
      }

      if (valid.length > 0) {
        const uploadFiles: FileUploadFile[] = valid.map(file => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          status: 'uploading' as const,
          progress: 0,
        }));

        onFilesChange?.([...files, ...uploadFiles]);

        if (onUpload) {
          try {
            await onUpload(valid);
            // Update status to success
            const updatedFiles = files.map(f => 
              uploadFiles.find(uf => uf.id === f.id) 
                ? { ...f, status: 'success' as const, progress: 100 }
                : f
            );
            onFilesChange?.(updatedFiles);
          } catch (err) {
            // Update status to error
            const updatedFiles = files.map(f => 
              uploadFiles.find(uf => uf.id === f.id) 
                ? { ...f, status: 'error' as const, error: 'Upload failed' }
                : f
            );
            onFilesChange?.(updatedFiles);
          }
        }
      }
    }, [validateFiles, files, onFilesChange, onUpload]);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    }, [disabled, handleFiles]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        handleFiles(Array.from(selectedFiles));
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }, [handleFiles]);

    const handleUploadClick = () => {
      inputRef.current?.click();
    };

    const handleUrlClick = async () => {
      if (onUrlUpload) {
        const url = prompt('Enter file URL:');
        if (url) {
          try {
            await onUrlUpload(url);
          } catch (err) {
            setError('Failed to upload from URL');
            setTimeout(() => setError(null), 3000);
          }
        }
      }
    };

    const iconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
    const buttonSize = size === 'sm' ? 'text-xs px-3 py-1.5' : size === 'lg' ? 'text-base px-5 py-2.5' : 'text-sm px-4 py-2';

    return (
      <div
        ref={ref}
        className={cn(fileUploadVariants({ size }), className)}
        {...props}
      >
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}

        <div
          className={cn(
            dropzoneVariants({ 
              size, 
              state: disabled ? 'disabled' : isDragging ? 'active' : error ? 'error' : 'default' 
            })
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          aria-label={ariaLabel || 'File upload dropzone'}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
            className="sr-only"
            aria-label="File input"
          />

          <Icon 
            icon="upload" 
            size={iconSize}
            className={cn(
              "mb-2",
              isDragging ? "text-primary-600" : "text-neutral-400"
            )}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={disabled}
              className={cn(
                "rounded-lg border border-neutral-300 bg-white font-medium transition-colors",
                "hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                buttonSize
              )}
            >
              {uploadButtonText}
            </button>

            {showUrlUpload && onUrlUpload && (
              <>
                <span className="text-sm text-neutral-500">{dropzoneText}</span>
                <button
                  type="button"
                  onClick={handleUrlClick}
                  disabled={disabled}
                  className={cn(
                    "font-medium text-primary-600 transition-colors",
                    "hover:text-primary-700 focus:outline-none focus:underline",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
                  )}
                >
                  {urlButtonText}
                </button>
              </>
            )}
            {!showUrlUpload && (
              <span className="text-sm text-neutral-500">{dropzoneText}</span>
            )}
          </div>

          {hint && (
            <p className={cn(
              "text-neutral-600 mt-1",
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'
            )}>
              {hint}
            </p>
          )}

          {error && (
            <p className="text-xs text-danger-600 mt-1">{error}</p>
          )}
        </div>

        {showFileList && files.length > 0 && (
          <div className="space-y-2">
            {files.map(file => (
              <FileItem 
                key={file.id}
                file={file}
                showPreview={showPreview}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

// Hook for file upload logic
export const useFileUpload = (options?: {
  maxSize?: number;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
}) => {
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: FileUploadFile[] = newFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading' as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
    return uploadFiles;
  }, []);

  const updateFile = useCallback((id: string, update: Partial<FileUploadFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...update } : f));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const uploadFiles = useCallback(async (
    filesToUpload: File[], 
    uploadFn: (file: File) => Promise<string>
  ) => {
    setUploading(true);
    setError(null);

    const uploadedFiles = addFiles(filesToUpload);

    try {
      for (const uploadFile of uploadedFiles) {
        try {
          // Simulate progress
          for (let i = 0; i <= 100; i += 10) {
            updateFile(uploadFile.id, { progress: i });
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          const url = await uploadFn(uploadFile.file);
          updateFile(uploadFile.id, { 
            status: 'success', 
            progress: 100, 
            url 
          });
        } catch (err) {
          updateFile(uploadFile.id, { 
            status: 'error', 
            error: err instanceof Error ? err.message : 'Upload failed' 
          });
          throw err;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [addFiles, updateFile]);

  const reset = useCallback(() => {
    setFiles([]);
    setError(null);
    setUploading(false);
  }, []);

  return {
    files,
    uploading,
    error,
    addFiles,
    updateFile,
    removeFile,
    uploadFiles,
    reset,
    setFiles,
  };
};

export { fileUploadVariants, dropzoneVariants, fileItemVariants };