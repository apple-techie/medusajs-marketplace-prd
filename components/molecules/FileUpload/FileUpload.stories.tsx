import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FileUpload, useFileUpload, type FileUploadFile } from './FileUpload';

const meta = {
  title: 'Molecules/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    accept: {
      control: 'text',
    },
    maxSize: {
      control: 'number',
    },
    maxFiles: {
      control: 'number',
    },
    multiple: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    showPreview: {
      control: 'boolean',
    },
    showFileList: {
      control: 'boolean',
    },
    showUrlUpload: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    label: 'Upload files',
    hint: 'Drag and drop files here or click to browse',
  },
};

// With custom text
export const CustomText: Story = {
  args: {
    label: 'Product Images',
    hint: 'Accept JPG, PNG up to 5MB',
    uploadButtonText: 'Choose images',
    urlButtonText: 'Import from URL',
    dropzoneText: 'or drop files here',
  },
};

// Multiple files
export const MultipleFiles: Story = {
  args: {
    label: 'Documents',
    hint: 'Upload multiple documents (PDF, DOC, TXT)',
    accept: '.pdf,.doc,.docx,.txt',
    multiple: true,
    maxFiles: 5,
  },
};

// Image only with preview
export const ImageUpload: Story = {
  args: {
    label: 'Profile Picture',
    hint: 'JPG or PNG, max 2MB',
    accept: 'image/*',
    maxSize: 2,
    showPreview: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    
    const handleUpload = async (uploadedFiles: File[]) => {
      console.log('Uploading files:', uploadedFiles);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    };
    
    const handleRemove = (fileId: string) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    };
    
    const handleUrlUpload = async (url: string) => {
      console.log('Uploading from URL:', url);
      // Simulate fetching file from URL
      const file = new File([''], url.split('/').pop() || 'file', { type: 'image/jpeg' });
      const uploadFile: FileUploadFile = {
        id: `${Date.now()}`,
        file,
        status: 'success',
        url,
      };
      setFiles(prev => [...prev, uploadFile]);
    };
    
    return (
      <FileUpload
        label="Upload files"
        hint="Accept image & video files"
        files={files}
        onFilesChange={setFiles}
        onUpload={handleUpload}
        onRemove={handleRemove}
        onUrlUpload={handleUrlUpload}
        multiple={true}
        showPreview={true}
      />
    );
  },
};

// E-commerce product images
export const ProductImages: Story = {
  render: () => {
    const { files, uploadFiles, removeFile, setFiles } = useFileUpload();
    
    const handleUpload = async (file: File): Promise<string> => {
      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `https://example.com/products/${file.name}`;
    };
    
    return (
      <div>
        <FileUpload
          label="Product Images"
          hint="Upload up to 5 images. First image will be the main product image."
          accept="image/*"
          multiple={true}
          maxFiles={5}
          maxSize={5}
          files={files}
          onFilesChange={(newFiles) => {
            setFiles(newFiles);
            // Auto-upload new files
            const filesToUpload = newFiles
              .filter(f => f.status === 'uploading' && !f.url)
              .map(f => f.file);
            if (filesToUpload.length > 0) {
              uploadFiles(filesToUpload, handleUpload);
            }
          }}
          onRemove={removeFile}
          showPreview={true}
        />
        
        {files.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Uploaded Images:</p>
            <ul className="text-sm text-neutral-600">
              {files.map((file, index) => (
                <li key={file.id}>
                  {index === 0 ? '⭐ Main: ' : `${index + 1}. `}
                  {file.file.name}
                  {file.status === 'success' && ' ✓'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

// Document upload for vendors
export const VendorDocuments: Story = {
  render: () => {
    const [documents, setDocuments] = useState<FileUploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    
    const requiredDocs = [
      'Business License',
      'Tax Certificate', 
      'Bank Statement',
      'ID Verification',
    ];
    
    const uploadedDocTypes = documents.map(d => 
      requiredDocs.find(type => d.file.name.toLowerCase().includes(type.toLowerCase()))
    ).filter(Boolean);
    
    const missingDocs = requiredDocs.filter(doc => !uploadedDocTypes.includes(doc));
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Vendor Verification Documents</h3>
          <p className="text-sm text-neutral-600">
            Please upload all required documents to complete your vendor profile.
          </p>
        </div>
        
        <FileUpload
          label="Upload Documents"
          hint="PDF or image files, max 10MB each"
          accept=".pdf,image/*"
          multiple={true}
          maxSize={10}
          files={documents}
          onFilesChange={setDocuments}
          onUpload={async (files) => {
            setUploading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setUploading(false);
          }}
          onRemove={(id) => setDocuments(prev => prev.filter(f => f.id !== id))}
          disabled={uploading}
        />
        
        {missingDocs.length > 0 && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm font-medium text-warning-800 mb-1">
              Missing Documents:
            </p>
            <ul className="text-sm text-warning-700">
              {missingDocs.map(doc => (
                <li key={doc}>• {doc}</li>
              ))}
            </ul>
          </div>
        )}
        
        {documents.length === requiredDocs.length && (
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700">
              ✓ All required documents uploaded successfully!
            </p>
          </div>
        )}
      </div>
    );
  },
};

// CSV import
export const CSVImport: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadFile[]>([]);
    const [importResult, setImportResult] = useState<{
      success: number;
      failed: number;
      errors: string[];
    } | null>(null);
    
    const handleImport = async (files: File[]) => {
      // Simulate CSV processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      setImportResult({
        success: 245,
        failed: 5,
        errors: [
          'Row 23: Invalid price format',
          'Row 67: Missing product name',
          'Row 89: Invalid category',
        ],
      });
    };
    
    return (
      <div className="space-y-4">
        <FileUpload
          label="Import Products"
          hint="Upload CSV file with product data"
          accept=".csv"
          maxSize={50}
          files={file}
          onFilesChange={setFile}
          onUpload={handleImport}
          uploadButtonText="Select CSV file"
          showUrlUpload={false}
          showFileList={true}
        />
        
        {file.length > 0 && file[0].status === 'uploading' && (
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-700">
              Processing CSV file... This may take a few moments.
            </p>
          </div>
        )}
        
        {importResult && (
          <div className="space-y-3">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium mb-2">Import Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Successful:</span>
                  <span className="ml-2 font-medium text-success-600">
                    {importResult.success}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Failed:</span>
                  <span className="ml-2 font-medium text-danger-600">
                    {importResult.failed}
                  </span>
                </div>
              </div>
            </div>
            
            {importResult.errors.length > 0 && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <h4 className="font-medium text-danger-800 mb-2">Errors:</h4>
                <ul className="text-sm text-danger-700 space-y-1">
                  {importResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
};

// States
export const States: Story = {
  render: () => {
    const states: FileUploadFile[] = [
      {
        id: '1',
        file: new File([''], 'uploading.jpg', { type: 'image/jpeg' }),
        status: 'uploading',
        progress: 65,
      },
      {
        id: '2',
        file: new File([''], 'success.pdf', { type: 'application/pdf' }),
        status: 'success',
      },
      {
        id: '3',
        file: new File([''], 'error.docx', { type: 'application/docx' }),
        status: 'error',
        error: 'Network error',
      },
    ];
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Default State</h3>
          <FileUpload label="Upload files" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">With Files</h3>
          <FileUpload 
            label="Upload files"
            files={states}
            showFileList={true}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Disabled State</h3>
          <FileUpload 
            label="Upload files"
            disabled={true}
          />
        </div>
      </div>
    );
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Small</h3>
        <FileUpload 
          size="sm"
          label="Small upload"
          hint="Compact size for limited space"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
        <FileUpload 
          size="md"
          label="Medium upload"
          hint="Standard size for most use cases"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Large</h3>
        <FileUpload 
          size="lg"
          label="Large upload"
          hint="Larger touch targets and text"
        />
      </div>
    </div>
  ),
};

// Without URL upload
export const NoUrlUpload: Story = {
  args: {
    label: 'Local files only',
    hint: 'URL upload is disabled',
    showUrlUpload: false,
  },
};

// Without file list
export const NoFileList: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    
    return (
      <div>
        <FileUpload
          label="Hidden file list"
          hint="Files are uploaded but not shown"
          files={files}
          onFilesChange={setFiles}
          showFileList={false}
          multiple={true}
        />
        <p className="mt-4 text-sm text-neutral-600">
          {files.length} file(s) selected
        </p>
      </div>
    );
  },
};

// Advanced file validation
export const AdvancedValidation: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const validateFile = (file: File): string | null => {
      // Custom validation logic
      if (file.name.length > 50) {
        return 'File name too long';
      }
      if (!file.name.match(/^[a-zA-Z0-9._-]+$/)) {
        return 'File name contains invalid characters';
      }
      return null;
    };
    
    const handleFilesChange = (newFiles: FileUploadFile[]) => {
      const newFilesOnly = newFiles.filter(f => !files.find(existing => existing.id === f.id));
      
      for (const fileUpload of newFilesOnly) {
        const error = validateFile(fileUpload.file);
        if (error) {
          setError(`${fileUpload.file.name}: ${error}`);
          setTimeout(() => setError(null), 3000);
          return;
        }
      }
      
      setFiles(newFiles);
    };
    
    return (
      <div>
        <FileUpload
          label="Strict validation"
          hint="Alphanumeric filenames only, max 50 characters"
          files={files}
          onFilesChange={handleFilesChange}
          onRemove={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
        />
        {error && (
          <div className="mt-2 p-2 bg-danger-50 text-danger-700 text-sm rounded">
            {error}
          </div>
        )}
      </div>
    );
  },
};