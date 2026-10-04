import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Base API URL from environment variables or empty string for proxy
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Format bytes into human-readable file size (KB, MB, etc.)
 */
function formatFileSize(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Clean uppercase extension/type
 */
function formatFileType(type, extension) {
  if (type) return type.toUpperCase();
  if (extension) return extension.replace('.', '').toUpperCase();
  return 'FILE';
}

/**
 * Return badge style class based on extension
 */
function getBadgeClass(type) {
  const t = (type || '').toLowerCase();
  if (t === 'pdf') return 'badge-pdf';
  if (t === 'docx' || t === 'doc') return 'badge-doc';
  if (t === 'pages') return 'badge-pages';
  return 'badge-generic';
}

/**
 * Resolve full URL for static files
 */
function resolveFileUrl(relativeUrl) {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  if (API_BASE) {
    return `${API_BASE.replace(/\/$/, '')}${relativeUrl}`;
  }
  return relativeUrl;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const searchInputRef = useRef(null);

  // Debounce search input by 220ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / '/' to focus search, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchTerm('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch files dynamically
  useEffect(() => {
    let isCancelled = false;

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = debouncedQuery.trim();
        const endpoint = query
          ? `/api/files/search?q=${encodeURIComponent(query)}`
          : '/api/files';
        const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}${endpoint}` : endpoint;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();

        if (!isCancelled) {
          setFiles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('API Error:', err);
          setError('Unable to load files. Please try again.');
          setFiles([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchFiles();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, refreshTrigger]);

  const handleOpenFile = useCallback((file) => {
    const targetUrl = resolveFileUrl(file.url);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleRetry = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const isSearching = Boolean(debouncedQuery.trim());

  return (
    <div className="layout-shell">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="eyebrow">Files</div>
          <h1 className="headline">Your documents, in one place.</h1>
        </header>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            ref={searchInputRef}
            id="file-search-input"
            type="text"
            className="search-input"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />

          <div className="search-actions">
            {searchTerm ? (
              <button
                id="clear-search-btn"
                type="button"
                className="icon-button"
                onClick={handleClear}
                title="Clear (Esc)"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : (
              <span className="search-glyph" aria-hidden="true">⌕</span>
            )}
          </div>
        </div>

        {/* Section Metadata & Hairline */}
        <div className="section-meta">
          <div className="meta-label">
            <span className="meta-title">
              {isSearching ? 'Search Results' : 'All Files'}
            </span>
            <span className="meta-separator">·</span>
            <span id="results-count" className="meta-count">
              {loading ? 'Searching...' : files.length}
            </span>
          </div>

          {loading && (
            <div className="loading-tag" id="loading-indicator">
              <span className="pulse-dot"></span>
              <span>Scanning</span>
            </div>
          )}
        </div>

        <div className="hairline-divider"></div>

        {/* Content Area */}
        <div className="results-container" id="file-results-container">
          {/* Error Banner */}
          {!loading && error && (
            <div className="state-banner error-banner" id="error-state">
              <p className="state-message">{error}</p>
              <button
                id="retry-btn"
                type="button"
                className="retry-btn"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && files.length === 0 && (
            <div className="state-banner empty-banner" id="empty-state">
              <p className="empty-title">No files found</p>
              <p className="empty-description">
                {isSearching
                  ? `No documents match "${debouncedQuery.trim()}"`
                  : 'No documents currently exist in backend/files.'}
              </p>
              {isSearching && (
                <button
                  type="button"
                  className="inline-clear-btn"
                  onClick={handleClear}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* File Rows */}
          {!error && files.length > 0 && (
            <ul className="file-list">
              {files.map((file, index) => {
                const badgeText = formatFileType(file.type, file.extension);
                const badgeStyle = getBadgeClass(file.type);
                const formattedSize = formatFileSize(file.size);

                return (
                  <li
                    key={file.name}
                    id={`file-card-${index}`}
                    className="file-row"
                    onClick={() => handleOpenFile(file)}
                    title={`Open ${file.name}`}
                  >
                    {/* Left: Icon & File Name */}
                    <div className="row-left">
                      <div className="document-icon" aria-hidden="true">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>

                      <span className="file-title">{file.name}</span>
                    </div>

                    {/* Right: Size, Type Badge, Open Action */}
                    <div className="row-right">
                      {formattedSize && (
                        <span className="file-size">{formattedSize}</span>
                      )}

                      <span className={`file-tag ${badgeStyle}`}>
                        {badgeText}
                      </span>

                      <button
                        id={`open-file-btn-${index}`}
                        type="button"
                        className="open-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFile(file);
                        }}
                      >
                        <span>Open</span>
                        <span className="arrow-glyph" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="footer">
          <span className="footer-item">
            Press <kbd className="key-hint">/</kbd> to search
          </span>
          <span className="footer-bullet">·</span>
          <span className="footer-item">
            Served dynamically from <code>backend/files</code>
          </span>
        </footer>
      </div>
    </div>
  );
}
