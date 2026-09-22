const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'requests.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function: Read requests from requests.json
function readRequests() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileData || '[]');
  } catch (err) {
    console.error('Error reading requests.json:', err.message);
    throw new Error('Unable to read requests data.');
  }
}

// Helper function: Write requests to requests.json
function writeRequests(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to requests.json:', err.message);
    throw new Error('Unable to save requests data.');
  }
}

// Basic input validation helper
function validateRequestBody(body) {
  const { studentName, email, category, problemDescription, priority } = body;

  if (!studentName || typeof studentName !== 'string' || !studentName.trim()) {
    return 'Student Name is required.';
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please provide a valid email address.';
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    return 'Category is required.';
  }
  if (!problemDescription || typeof problemDescription !== 'string' || !problemDescription.trim()) {
    return 'Problem Description is required.';
  }
  if (!priority || typeof priority !== 'string' || !priority.trim()) {
    return 'Priority is required.';
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (!validPriorities.includes(priority.trim())) {
    return 'Priority must be one of: Low, Medium, High, Urgent.';
  }

  return null; // Valid
}

// -------------------------------------------------------------
// CANONICAL API ENDPOINTS (/api/requests)
// -------------------------------------------------------------

// Root endpoint for status/info
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Campus Help Desk API is running.',
    endpoints: {
      getAllRequests: 'GET /api/requests',
      getRequestById: 'GET /api/requests/:id',
      createRequest: 'POST /api/requests',
      updateRequest: 'PUT /api/requests/:id',
      deleteRequest: 'DELETE /api/requests/:id'
    }
  });
});

// 1. GET /api/requests - Get all campus requests
app.get('/api/requests', (req, res) => {
  try {
    const requests = readRequests();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/requests/:id - Get a single campus request by ID
app.get('/api/requests/:id', (req, res) => {
  try {
    const requests = readRequests();
    const requestId = req.params.id;
    const foundRequest = requests.find((r) => String(r.id) === String(requestId));

    if (!foundRequest) {
      return res.status(404).json({ error: `Request with ID '${requestId}' not found.` });
    }

    res.status(200).json(foundRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /api/requests - Create a new campus request
app.post('/api/requests', (req, res) => {
  try {
    const validationError = validateRequestBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const requests = readRequests();

    const newRequest = {
      id: Date.now().toString(),
      studentName: req.body.studentName.trim(),
      email: req.body.email.trim(),
      category: req.body.category.trim(),
      problemDescription: req.body.problemDescription.trim(),
      priority: req.body.priority.trim(),
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    writeRequests(requests);

    res.status(201).json({
      message: 'Campus request submitted successfully.',
      request: newRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT /api/requests/:id - Update an existing campus request
app.put('/api/requests/:id', (req, res) => {
  try {
    const requestId = req.params.id;
    const validationError = validateRequestBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const requests = readRequests();
    const index = requests.findIndex((r) => String(r.id) === String(requestId));

    if (index === -1) {
      return res.status(404).json({ error: `Request with ID '${requestId}' not found.` });
    }

    // Preserve the original id and createdAt timestamp
    const updatedRequest = {
      ...requests[index],
      studentName: req.body.studentName.trim(),
      email: req.body.email.trim(),
      category: req.body.category.trim(),
      problemDescription: req.body.problemDescription.trim(),
      priority: req.body.priority.trim(),
      updatedAt: new Date().toISOString()
    };

    requests[index] = updatedRequest;
    writeRequests(requests);

    res.status(200).json({
      message: 'Campus request updated successfully.',
      request: updatedRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE /api/requests/:id - Delete a campus request
app.delete('/api/requests/:id', (req, res) => {
  try {
    const requestId = req.params.id;
    const requests = readRequests();
    const index = requests.findIndex((r) => String(r.id) === String(requestId));

    if (index === -1) {
      return res.status(404).json({ error: `Request with ID '${requestId}' not found.` });
    }

    const deletedRequest = requests.splice(index, 1)[0];
    writeRequests(requests);

    res.status(200).json({
      message: 'Campus request deleted successfully.',
      deletedRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Campus Help Desk server is running at http://localhost:${PORT}`);
});
