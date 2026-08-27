import { useRef, useState } from 'react';

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.webp';

export default function FileUpload({ onUpload, isLoading }) {
  const inputRef   = useRef(null);
  const [drag, setDrag] = useState(false);
  const [name, setName] = useState('');

  function handleFile(file) {
    if (!file) return;
    setName(file.name);
    onUpload(file);
  }

  return (
    <div
      className={`file-upload-zone ${drag ? 'file-upload-zone--active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ''; }}
        style={{ display: 'none' }}
      />
      <span className="upload-icon">
        {isLoading ? '⏳' : name ? '✅' : '📄'}
      </span>
      <span>
        {isLoading
          ? 'Processing file…'
          : name
            ? `${name} — click to replace`
            : 'Drop a PDF or image here, or click to browse'}
      </span>
    </div>
  );
}
