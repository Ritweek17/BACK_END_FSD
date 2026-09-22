import React, { useState, useEffect } from 'react';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';

// Canonical API URL pointing directly to the Express backend
const API_URL = 'http://localhost:3000/api/requests';

function App() {
  // Main application state
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [editingRequest, setEditingRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Load requests on initial mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Auto-dismiss toast notifications after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * GET /api/requests: Fetch all campus requests
   */
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(
        'Cannot connect to backend server at http://localhost:3000. Please ensure the Express backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Form submission for either CREATE (POST) or UPDATE (PUT)
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingRequest) {
        // PUT /api/requests/:id
        const res = await fetch(`${API_URL}/${editingRequest.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Failed to update request.');
        }

        setToast({
          message: 'Campus request updated successfully!',
          type: 'success'
        });
        setEditingRequest(null);
      } else {
        // POST /api/requests
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Failed to submit request.');
        }

        setToast({
          message: 'Campus request submitted successfully!',
          type: 'success'
        });
      }

      // Refresh list after create or update
      await fetchRequests();
      return true;
    } catch (err) {
      console.error('Form submit error:', err);
      setToast({
        message: err.message || 'An error occurred while saving.',
        type: 'error'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Start editing a request
   */
  const handleEdit = (request) => {
    setEditingRequest(request);
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Cancel editing mode
   */
  const handleCancelEdit = () => {
    setEditingRequest(null);
  };

  /**
   * DELETE /api/requests/:id: Delete a campus request
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this campus request?'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete request.');
      }

      setToast({
        message: 'Campus request deleted successfully.',
        type: 'success'
      });

      // If currently editing the deleted request, exit edit mode
      if (editingRequest && editingRequest.id === id) {
        setEditingRequest(null);
      }

      await fetchRequests();
    } catch (err) {
      console.error('Delete request error:', err);
      setToast({
        message: err.message || 'Unable to delete request.',
        type: 'error'
      });
    }
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="container navbar-container">
          <div className="brand">
            <div className="brand-icon">🏛️</div>
            <div>
              <h1 className="brand-title">Campus Help Desk</h1>
              <p className="brand-subtitle">
                Student Support & Request Management System (React + Express)
              </p>
            </div>
          </div>
          <div className="nav-badge">
            <span className="live-indicator"></span> System Active
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container" role="alert">
          <div className={`toast toast-${toast.type}`}>
            <span>
              {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
            </span>
            <button
              className="toast-close"
              onClick={() => setToast(null)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container main-content">
        {/* Error Banner when backend is unreachable */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button className="btn-retry" onClick={fetchRequests}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Request Submission & Edit Form */}
        <RequestForm
          onSubmit={handleFormSubmit}
          editingRequest={editingRequest}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        {/* Submitted Requests Display & Filters */}
        <RequestList
          requests={requests}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>
            Campus Help Desk • FSD Assignment 4 • Built with React 18, Vite &
            Express <code>requests.json</code> API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
