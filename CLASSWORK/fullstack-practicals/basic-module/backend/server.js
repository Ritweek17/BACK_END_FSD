const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Lightweight .env file loader (no extra dependencies required)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

// Path to the document/files directory
const FILES_DIR = path.join(__dirname, 'files');

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Scan the files directory dynamically and return file metadata.
 * Source of truth is the actual filesystem.
 */
function getAvailableFiles() {
  try {
    if (!fs.existsSync(FILES_DIR)) {
      return [];
    }

    const entries = fs.readdirSync(FILES_DIR, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      // Exclude hidden files (e.g. .DS_Store) and subdirectories
      if (entry.name.startsWith('.') || !entry.isFile()) {
        continue;
      }

      const filePath = path.join(FILES_DIR, entry.name);
      try {
        const stats = fs.statSync(filePath);
        const ext = path.extname(entry.name);
        const type = ext ? ext.slice(1).toLowerCase() : 'unknown';

        files.push({
          name: entry.name,
          type: type,
          extension: ext.toLowerCase(),
          size: stats.size,
          url: `/files/${encodeURIComponent(entry.name)}`
        });
      } catch (statError) {
        console.error(`Error reading stats for file "${entry.name}":`, statError.message);
      }
    }

    return files;
  } catch (error) {
    console.error('Error scanning files directory:', error.message);
    return [];
  }
}

/**
 * Static file serving route for documents.
 * express.static strictly bounds lookups within FILES_DIR, preventing path traversal attacks.
 */
app.use(
  '/files',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(FILES_DIR, {
    dotfiles: 'ignore',
    index: false,
    fallthrough: false // trigger error handler if file is not found inside FILES_DIR
  })
);

// Fallback error handler for /files to return clean JSON when file not found or forbidden
app.use('/files', (err, req, res, next) => {
  if (err.status === 404 || err.statusCode === 404 || err.code === 'ENOENT') {
    return res.status(404).json({ error: 'File not found' });
  }
  if (err.status === 403 || err.statusCode === 403) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next(err);
});

/**
 * GET /api
 * API documentation and health check endpoint
 */
app.get('/api', (req, res) => {
  res.json({
    name: 'File Search API',
    status: 'online',
    endpoints: {
      allFiles: 'GET /api/files',
      search: 'GET /api/files/search?q=:query',
      staticFile: 'GET /files/:filename'
    }
  });
});

/**
 * GET /api/files
 * Returns all available files dynamically scanned from the filesystem
 */
app.get('/api/files', (req, res) => {
  try {
    const files = getAvailableFiles();
    res.json(files);
  } catch (err) {
    console.error('Failed to get files:', err);
    res.status(500).json({ error: 'Unable to load files' });
  }
});

/**
 * GET /api/files/search?q=:searchTerm
 * Case-insensitive partial filename search
 */
app.get('/api/files/search', (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const allFiles = getAvailableFiles();

    if (!query) {
      return res.json(allFiles);
    }

    const filtered = allFiles.filter((file) =>
      file.name.toLowerCase().includes(query)
    );

    res.json(filtered);
  } catch (err) {
    console.error('Failed to search files:', err);
    res.status(500).json({ error: 'Unable to search files' });
  }
});

// Generic 404 handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`Serving documents from: ${FILES_DIR}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Please check running processes or set PORT in .env`);
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;
