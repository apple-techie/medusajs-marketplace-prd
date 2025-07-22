import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload, useFileUpload } from './FileUpload';
import { renderHook, act } from '@testing-library/react';

// Mock file creation helper
const createMockFile = (name: string, size: number, type: string): File => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUpload Component', () => {
  it('renders with label', () => {
    render(<FileUpload label="Upload documents" />);
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
  });

  it('renders with hint text', () => {
    render(<FileUpload hint="Accept image & video" />);
    expect(screen.getByText('Accept image & video')).toBeInTheDocument();
  });

  it('renders upload button with custom text', () => {
    render(<FileUpload uploadButtonText="Choose file" />);
    expect(screen.getByText('Choose file')).toBeInTheDocument();
  });

  it('renders URL upload button when enabled', () => {
    const mockUrlUpload = jest.fn();
    render(<FileUpload showUrlUpload={true} onUrlUpload={mockUrlUpload} />);
    expect(screen.getByText('Add from URL')).toBeInTheDocument();
  });

  it('hides URL upload button when disabled', () => {
    render(<FileUpload showUrlUpload={false} />);
    expect(screen.queryByText('Add from URL')).not.toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FileUpload onFilesChange={mockOnFilesChange} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, file);
    
    expect(mockOnFilesChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          file,
          status: 'uploading',
          progress: 0,
        })
      ])
    );
  });

  it('handles multiple file selection', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FileUpload multiple={true} onFilesChange={mockOnFilesChange} />);
    
    const files = [
      createMockFile('test1.pdf', 1024, 'application/pdf'),
      createMockFile('test2.jpg', 2048, 'image/jpeg'),
    ];
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, files);
    
    expect(mockOnFilesChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ file: files[0] }),
        expect.objectContaining({ file: files[1] }),
      ])
    );
  });

  it('validates file size', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FileUpload maxSize={1} onFilesChange={mockOnFilesChange} />);
    
    const file = createMockFile('large.pdf', 2 * 1024 * 1024, 'application/pdf');
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('large.pdf exceeds 1MB limit')).toBeInTheDocument();
    });
    expect(mockOnFilesChange).not.toHaveBeenCalled();
  });

  it('validates file type', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FileUpload accept="image/*" onFilesChange={mockOnFilesChange} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf is not an accepted file type')).toBeInTheDocument();
    });
    expect(mockOnFilesChange).not.toHaveBeenCalled();
  });

  it('enforces max files limit', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    const existingFiles = [
      {
        id: '1',
        file: createMockFile('existing.pdf', 1024, 'application/pdf'),
        status: 'success' as const,
      },
    ];
    
    render(
      <FileUpload 
        files={existingFiles}
        maxFiles={2} 
        multiple={true}
        onFilesChange={mockOnFilesChange} 
      />
    );
    
    const files = [
      createMockFile('new1.pdf', 1024, 'application/pdf'),
      createMockFile('new2.pdf', 1024, 'application/pdf'),
    ];
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, files);
    
    await waitFor(() => {
      expect(screen.getByText('Maximum 2 files allowed')).toBeInTheDocument();
    });
  });

  it('handles drag and drop', async () => {
    const mockOnFilesChange = jest.fn();
    render(<FileUpload onFilesChange={mockOnFilesChange} />);
    
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    
    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('border-primary-500', 'bg-primary-50');
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    expect(mockOnFilesChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ file })
      ])
    );
  });

  it('shows file list when enabled', () => {
    const files = [
      {
        id: '1',
        file: createMockFile('test.pdf', 1024, 'application/pdf'),
        status: 'success' as const,
      },
    ];
    
    render(<FileUpload files={files} showFileList={true} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('hides file list when disabled', () => {
    const files = [
      {
        id: '1',
        file: createMockFile('test.pdf', 1024, 'application/pdf'),
        status: 'success' as const,
      },
    ];
    
    render(<FileUpload files={files} showFileList={false} />);
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });

  it('shows image preview for image files', () => {
    const files = [
      {
        id: '1',
        file: createMockFile('image.jpg', 1024, 'image/jpeg'),
        status: 'success' as const,
        url: 'http://example.com/image.jpg',
      },
    ];
    
    render(<FileUpload files={files} showPreview={true} />);
    const img = screen.getByAltText('image.jpg');
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('handles file removal', () => {
    const mockOnRemove = jest.fn();
    const files = [
      {
        id: '1',
        file: createMockFile('test.pdf', 1024, 'application/pdf'),
        status: 'success' as const,
      },
    ];
    
    render(<FileUpload files={files} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByLabelText('Remove test.pdf');
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('shows upload progress', () => {
    const files = [
      {
        id: '1',
        file: createMockFile('test.pdf', 1024, 'application/pdf'),
        status: 'uploading' as const,
        progress: 50,
      },
    ];
    
    render(<FileUpload files={files} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const files = [
      {
        id: '1',
        file: createMockFile('test.pdf', 1024, 'application/pdf'),
        status: 'error' as const,
        error: 'Upload failed',
      },
    ];
    
    render(<FileUpload files={files} />);
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('handles URL upload', () => {
    const mockOnUrlUpload = jest.fn();
    window.prompt = jest.fn(() => 'http://example.com/file.pdf');
    
    render(<FileUpload onUrlUpload={mockOnUrlUpload} />);
    
    const urlButton = screen.getByText('Add from URL');
    fireEvent.click(urlButton);
    
    expect(mockOnUrlUpload).toHaveBeenCalledWith('http://example.com/file.pdf');
  });

  it('disables interactions when disabled', async () => {
    const mockOnFilesChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FileUpload disabled={true} onFilesChange={mockOnFilesChange} />);
    
    const uploadButton = screen.getByText('Upload file');
    expect(uploadButton).toBeDisabled();
    
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });
    expect(dropzone).toHaveClass('cursor-not-allowed');
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('File input');
    
    await user.upload(input, file);
    expect(mockOnFilesChange).not.toHaveBeenCalled();
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(<FileUpload size="sm" />);
    const smDropzone = smContainer.querySelector('[role="button"]');
    expect(smDropzone).toHaveClass('h-32');

    const { container: lgContainer } = render(<FileUpload size="lg" />);
    const lgDropzone = lgContainer.querySelector('[role="button"]');
    expect(lgDropzone).toHaveClass('h-48');
  });

  it('applies custom className', () => {
    const { container } = render(<FileUpload className="custom-upload" />);
    expect(container.firstChild).toHaveClass('custom-upload');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<FileUpload ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useFileUpload Hook', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFileUpload());
    
    expect(result.current.files).toEqual([]);
    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds files', () => {
    const { result } = renderHook(() => useFileUpload());
    
    const files = [
      createMockFile('test1.pdf', 1024, 'application/pdf'),
      createMockFile('test2.jpg', 2048, 'image/jpeg'),
    ];
    
    act(() => {
      result.current.addFiles(files);
    });
    
    expect(result.current.files).toHaveLength(2);
    expect(result.current.files[0].file).toBe(files[0]);
    expect(result.current.files[1].file).toBe(files[1]);
  });

  it('updates file status', () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    
    act(() => {
      const addedFiles = result.current.addFiles([file]);
      result.current.updateFile(addedFiles[0].id, { 
        status: 'success', 
        progress: 100 
      });
    });
    
    expect(result.current.files[0].status).toBe('success');
    expect(result.current.files[0].progress).toBe(100);
  });

  it('removes file', () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    
    act(() => {
      const addedFiles = result.current.addFiles([file]);
      result.current.removeFile(addedFiles[0].id);
    });
    
    expect(result.current.files).toHaveLength(0);
  });

  it('handles upload with progress', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const mockUploadFn = jest.fn().mockResolvedValue('http://example.com/test.pdf');
    
    await act(async () => {
      await result.current.uploadFiles([file], mockUploadFn);
    });
    
    expect(mockUploadFn).toHaveBeenCalledWith(file);
    expect(result.current.files[0].status).toBe('success');
    expect(result.current.files[0].url).toBe('http://example.com/test.pdf');
  });

  it('handles upload error', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const mockUploadFn = jest.fn().mockRejectedValue(new Error('Network error'));
    
    await act(async () => {
      await result.current.uploadFiles([file], mockUploadFn);
    });
    
    expect(result.current.files[0].status).toBe('error');
    expect(result.current.files[0].error).toBe('Network error');
    expect(result.current.error).toBe('Network error');
  });

  it('resets state', () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    
    act(() => {
      result.current.addFiles([file]);
      result.current.reset();
    });
    
    expect(result.current.files).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.uploading).toBe(false);
  });
});