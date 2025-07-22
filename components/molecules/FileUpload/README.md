# FileUpload Component

A flexible file upload component that supports drag-and-drop, file selection, URL imports, and progress tracking. Designed for e-commerce scenarios like product images, vendor documents, and bulk imports. Features file validation, preview support, and comprehensive state management.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { FileUpload, useFileUpload } from '@/components/molecules/FileUpload';

// Basic file upload
<FileUpload 
  label="Upload files"
  hint="Drag and drop or click to browse"
  onFilesChange={(files) => console.log(files)}
/>

// Multiple files with validation
<FileUpload 
  label="Product Images"
  hint="JPG or PNG, max 5MB each"
  accept="image/*"
  multiple={true}
  maxSize={5}
  maxFiles={10}
  showPreview={true}
/>

// Using the hook
function ProductImageUpload() {
  const { files, uploadFiles, removeFile, error } = useFileUpload();
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { 
      method: 'POST', 
      body: formData 
    });
    const data = await response.json();
    return data.url;
  };
  
  return (
    <FileUpload
      files={files}
      onFilesChange={(newFiles) => {
        // Auto-upload new files
        const toUpload = newFiles.filter(f => f.status === 'uploading');
        if (toUpload.length > 0) {
          uploadFiles(toUpload.map(f => f.file), handleUpload);
        }
      }}
      onRemove={removeFile}
    />
  );
}
```

## Component Props

### FileUpload Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Field label |
| `hint` | `string` | - | Helper text below dropzone |
| `accept` | `string` | `'*'` | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | `10` | Max file size in MB |
| `maxFiles` | `number` | `10` | Max number of files |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `showPreview` | `boolean` | `true` | Show image previews |
| `showFileList` | `boolean` | `true` | Show uploaded files list |
| `showUrlUpload` | `boolean` | `true` | Show URL upload option |
| `uploadButtonText` | `string` | `'Upload file'` | Upload button text |
| `urlButtonText` | `string` | `'Add from URL'` | URL button text |
| `dropzoneText` | `string` | `'or drag and drop'` | Dropzone hint text |
| `files` | `FileUploadFile[]` | `[]` | Current files array |
| `onFilesChange` | `(files: FileUploadFile[]) => void` | - | Files change callback |
| `onUpload` | `(files: File[]) => Promise<void>` | - | Upload handler |
| `onRemove` | `(fileId: string) => void` | - | Remove file handler |
| `onUrlUpload` | `(url: string) => Promise<void>` | - | URL upload handler |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `className` | `string` | - | Additional CSS classes |

### FileUploadFile Interface

```tsx
interface FileUploadFile {
  id: string;
  file: File;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}
```

### useFileUpload Hook

```tsx
const {
  files,          // Current files array
  uploading,      // Upload in progress
  error,          // Current error
  addFiles,       // Add new files
  updateFile,     // Update file status
  removeFile,     // Remove a file
  uploadFiles,    // Upload files with progress
  reset,          // Reset all state
  setFiles,       // Set files directly
} = useFileUpload(options);
```

## Examples

### E-commerce Use Cases

#### Product Image Upload
```tsx
function ProductImageUpload() {
  const [productImages, setProductImages] = useState<FileUploadFile[]>([]);
  
  const handleImageUpload = async (files: File[]) => {
    // Upload to your CDN/storage
    for (const file of files) {
      const url = await uploadToStorage(file);
      // Update product with new image URL
    }
  };
  
  return (
    <div>
      <FileUpload
        label="Product Images"
        hint="Upload up to 8 images. First image will be the main product image."
        accept="image/jpeg,image/png,image/webp"
        multiple={true}
        maxFiles={8}
        maxSize={5}
        files={productImages}
        onFilesChange={setProductImages}
        onUpload={handleImageUpload}
        showPreview={true}
      />
      
      {productImages.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {productImages.map((img, index) => (
            <div key={img.id} className="relative">
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Vendor Document Upload
```tsx
function VendorDocuments() {
  const { files, uploadFiles, removeFile, error } = useFileUpload({
    maxSize: 10,
    accept: '.pdf,image/*',
  });
  
  const requiredDocuments = [
    { type: 'business_license', label: 'Business License' },
    { type: 'tax_certificate', label: 'Tax Certificate' },
    { type: 'bank_statement', label: 'Bank Statement' },
  ];
  
  const uploadDocument = async (file: File, docType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);
    
    const response = await fetch('/api/vendor/documents', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  };
  
  return (
    <div className="space-y-6">
      {requiredDocuments.map(doc => (
        <div key={doc.type}>
          <FileUpload
            label={doc.label}
            hint="PDF or image file, max 10MB"
            accept=".pdf,image/*"
            maxSize={10}
            files={files.filter(f => f.file.name.includes(doc.type))}
            onFilesChange={async (newFiles) => {
              // Handle file upload for specific document type
              const file = newFiles[0];
              if (file && file.status === 'uploading') {
                await uploadFiles([file.file], (f) => uploadDocument(f, doc.type));
              }
            }}
            onRemove={removeFile}
            showUrlUpload={false}
          />
        </div>
      ))}
    </div>
  );
}
```

#### Bulk Product Import
```tsx
function BulkProductImport() {
  const [importFile, setImportFile] = useState<FileUploadFile[]>([]);
  const [importStatus, setImportStatus] = useState<{
    processing: boolean;
    results?: {
      success: number;
      failed: number;
      errors: string[];
    };
  }>({ processing: false });
  
  const handleCSVImport = async (files: File[]) => {
    setImportStatus({ processing: true });
    
    const formData = new FormData();
    formData.append('csv', files[0]);
    
    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });
      
      const results = await response.json();
      setImportStatus({ processing: false, results });
    } catch (error) {
      setImportStatus({ processing: false });
      throw error;
    }
  };
  
  return (
    <div className="space-y-4">
      <FileUpload
        label="Import Products"
        hint="Upload CSV file with product data (max 50MB)"
        accept=".csv"
        maxSize={50}
        files={importFile}
        onFilesChange={setImportFile}
        onUpload={handleCSVImport}
        showUrlUpload={false}
        uploadButtonText="Select CSV File"
        disabled={importStatus.processing}
      />
      
      {importStatus.processing && (
        <div className="p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-700">Processing import...</p>
        </div>
      )}
      
      {importStatus.results && (
        <div className="p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium mb-2">Import Results</h4>
          <p className="text-sm text-success-600">
            ✓ {importStatus.results.success} products imported
          </p>
          {importStatus.results.failed > 0 && (
            <p className="text-sm text-danger-600">
              ✗ {importStatus.results.failed} products failed
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Advanced Examples

#### With Custom Validation
```tsx
function RestrictedUpload() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const validateProductImage = (file: File): string | null => {
    // Check dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 800) {
          resolve('Image must be at least 800x800 pixels');
        } else if (img.width / img.height > 2 || img.height / img.width > 2) {
          resolve('Image aspect ratio must be between 1:2 and 2:1');
        } else {
          resolve(null);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };
  
  const handleFilesChange = async (newFiles: FileUploadFile[]) => {
    for (const fileUpload of newFiles) {
      if (fileUpload.status === 'uploading') {
        const error = await validateProductImage(fileUpload.file);
        if (error) {
          setValidationError(error);
          return;
        }
      }
    }
    setFiles(newFiles);
  };
  
  return (
    <FileUpload
      label="Product Images"
      hint="Min 800x800px, aspect ratio 1:2 to 2:1"
      accept="image/*"
      files={files}
      onFilesChange={handleFilesChange}
      showPreview={true}
    />
  );
}
```

#### With URL Import
```tsx
function ImageGallery() {
  const [images, setImages] = useState<FileUploadFile[]>([]);
  
  const importFromUrl = async (url: string) => {
    try {
      // Validate URL
      const response = await fetch(`/api/validate-image-url?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!data.valid) {
        throw new Error(data.error || 'Invalid image URL');
      }
      
      // Create file object from URL
      const file = new File([new Blob()], data.filename, { 
        type: data.contentType 
      });
      
      const uploadFile: FileUploadFile = {
        id: Date.now().toString(),
        file,
        status: 'success',
        url: data.cdnUrl, // URL from your CDN
      };
      
      setImages(prev => [...prev, uploadFile]);
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <FileUpload
      label="Gallery Images"
      files={images}
      onFilesChange={setImages}
      onUrlUpload={importFromUrl}
      showPreview={true}
      multiple={true}
    />
  );
}
```

#### Progress Tracking
```tsx
function UploadWithProgress() {
  const { files, updateFile, setFiles } = useFileUpload();
  
  const uploadWithProgress = async (file: File, fileId: string) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        updateFile(fileId, { progress });
      }
    });
    
    return new Promise<string>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          reject(new Error('Upload failed'));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };
  
  return (
    <FileUpload
      files={files}
      onFilesChange={setFiles}
      onUpload={async (uploadedFiles) => {
        for (const file of uploadedFiles) {
          const fileUpload = files.find(f => f.file === file);
          if (fileUpload) {
            try {
              const url = await uploadWithProgress(file, fileUpload.id);
              updateFile(fileUpload.id, { status: 'success', url });
            } catch (error) {
              updateFile(fileUpload.id, { 
                status: 'error', 
                error: error.message 
              });
            }
          }
        }
      }}
    />
  );
}
```

## Styling

### Sizes
```tsx
// Small - compact for limited space
<FileUpload size="sm" label="Small upload" />

// Medium - default size
<FileUpload size="md" label="Medium upload" />

// Large - larger touch targets
<FileUpload size="lg" label="Large upload" />
```

### States
- **Default**: Ready for file selection
- **Dragging**: Visual feedback during drag-over
- **Disabled**: All interactions disabled
- **Error**: Validation or upload errors

### Custom Styling
```tsx
<FileUpload 
  className="custom-upload"
  label="Styled upload"
/>
```

## Accessibility

- Keyboard navigation support
- ARIA labels for all interactive elements
- Screen reader announcements for file operations
- Focus indicators for keyboard users
- Error announcements for validation

## File Type Examples

```tsx
// Images only
<FileUpload accept="image/*" />

// Specific image formats
<FileUpload accept="image/jpeg,image/png,image/webp" />

// Documents
<FileUpload accept=".pdf,.doc,.docx" />

// Spreadsheets
<FileUpload accept=".csv,.xlsx,.xls" />

// Multiple types
<FileUpload accept="image/*,.pdf,.doc,.docx" />
```

## Best Practices

1. **File validation**: Validate file type, size, and dimensions before upload
2. **Progress feedback**: Show upload progress for better UX
3. **Error handling**: Display clear error messages for failed uploads
4. **Preview support**: Show image previews when applicable
5. **Chunk uploads**: For large files, implement chunked uploads
6. **Security**: Validate files server-side, never trust client validation
7. **Accessibility**: Ensure keyboard navigation and screen reader support