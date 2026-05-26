import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { AssignmentAPI } from '../../lib/api';
import toast from 'react-hot-toast';

interface UploadZoneProps {
  onTextExtracted: (text: string) => void;
}

export default function UploadZone({ onTextExtracted }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setIsExtracting(true);

      try {
        const text = await AssignmentAPI.extractText(selectedFile);
        onTextExtracted(text);
        toast.success('Text extracted from file');
      } catch (err) {
        toast.error('Failed to extract text from file');
        setFile(null);
      } finally {
        setIsExtracting(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const removeFile = () => {
    setFile(null);
    onTextExtracted('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="mb-4">
      {!file ? (
        <div
          className="rounded-xl flex flex-col items-center justify-center py-8 transition-colors cursor-pointer"
          style={{
            border: `1.5px dashed ${isDragging ? '#FF6A3D' : '#CACACA'}`,
            background: isDragging ? '#FFF7ED' : '#FAFAFA',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload
            size={28}
            style={{
              color: isDragging ? '#FF6A3D' : '#9CA3AF',
              marginBottom: '12px',
            }}
          />
          <p style={{ fontSize: '14px', color: '#1A1A1A', marginBottom: '4px' }}>
            Choose a file or drag & drop it here
          </p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>
            PDF, TXT — up to 10MB
          </p>
          <span
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              textDecoration: 'underline',
            }}
          >
            Browse Files
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      ) : (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ border: '1px solid #EAEAEA', background: '#FAFAFA' }}
        >
          <FileText size={20} style={{ color: '#FF6A3D' }} />
          <div className="flex-1 min-w-0">
            <p
              className="truncate"
              style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A' }}
            >
              {file.name}
            </p>
            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
              {isExtracting
                ? 'Extracting text...'
                : `${(file.size / 1024).toFixed(1)} KB`}
            </p>
          </div>
          {isExtracting ? (
            <Loader2 size={16} className="animate-spin" style={{ color: '#FF6A3D' }} />
          ) : (
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X size={16} style={{ color: '#9CA3AF' }} />
            </button>
          )}
        </div>
      )}
      <p
        className="text-center mt-2"
        style={{ fontSize: '12px', color: '#9CA3AF' }}
      >
        Upload a document to base questions on its content (optional)
      </p>
    </div>
  );
}
