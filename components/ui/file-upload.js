'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText } from 'lucide-react';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUpload({ onFiles, accept, maxSize, maxFiles = 5, className }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const processFiles = useCallback(
    (incoming) => {
      setError('');
      let list = Array.from(incoming);

      if (maxFiles && files.length + list.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        list = list.slice(0, maxFiles - files.length);
      }

      if (maxSize) {
        const oversized = list.find((f) => f.size > maxSize);
        if (oversized) {
          setError(`File "${oversized.name}" exceeds ${formatSize(maxSize)}`);
          list = list.filter((f) => f.size <= maxSize);
        }
      }

      if (list.length === 0) return;

      const next = [...files, ...list];
      setFiles(next);
      onFiles?.(next);
    },
    [files, maxFiles, maxSize, onFiles]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleChange = useCallback(
    (e) => {
      processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index) => {
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      onFiles?.(next);
    },
    [files, onFiles]
  );

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 py-8 px-4',
          'border-2 border-dashed rounded-[var(--radius-lg)]',
          'cursor-pointer transition-all duration-200',
          dragOver
            ? 'border-[var(--gold)] bg-[rgba(139,105,20,0.04)]'
            : 'border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--cream)]'
        )}
      >
        <Upload size={24} className="text-[var(--brown-soft)]" />
        <p className="text-[13px] text-[var(--brown)]">
          <span className="font-medium text-[var(--gold)]">Click to upload</span>
          {' '}or drag and drop
        </p>
        {accept && (
          <p className="text-[11px] text-[var(--brown-soft)]">{accept}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-[var(--red)]">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--cream)] border border-[var(--border-default)] rounded-[var(--radius-md)]"
            >
              <FileText size={14} className="text-[var(--brown-soft)] flex-shrink-0" />
              <span className="text-[12px] text-[var(--brown)] truncate flex-1">
                {f.name}
              </span>
              <span className="text-[11px] text-[var(--brown-soft)] flex-shrink-0">
                {formatSize(f.size)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-[var(--brown-soft)] hover:text-[var(--red)] transition-colors cursor-pointer flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
