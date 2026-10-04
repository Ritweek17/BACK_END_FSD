import React, { useState, useEffect } from 'react';

/**
 * RequestForm component handles both creating new requests and editing existing ones.
 * Uses local state for form inputs and client-side validation.
 */
function RequestForm({ onSubmit, editingRequest, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    category: '',
    problemDescription: '',
    priority: ''
  });

  const [errors, setErrors] = useState({});

  // Sync form inputs when editingRequest changes
  useEffect(() => {
    if (editingRequest) {
      setFormData({
        studentName: editingRequest.studentName || '',
        email: editingRequest.email || '',
        category: editingRequest.category || '',
        problemDescription: editingRequest.problemDescription || '',
        priority: editingRequest.priority || ''
      });
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingRequest]);

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Campus email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level.';
    }

    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = 'Problem description cannot be empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedData = {
      studentName: formData.studentName.trim(),
      email: formData.email.trim(),
      category: formData.category.trim(),
      problemDescription: formData.problemDescription.trim(),
      priority: formData.priority.trim()
    };

    const success = await onSubmit(trimmedData);
    if (success && !editingRequest) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      email: '',
      category: '',
      problemDescription: '',
      priority: ''
    });
    setErrors({});
  };

  return (
    <section className="card form-card" id="form-section">
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">
            {editingRequest ? 'Edit Campus Request' : 'Submit a Campus Request'}
          </h2>
          <p className="card-subtitle">
            {editingRequest
              ? `Updating request ID: ${editingRequest.id}`
              : 'Have an issue with hostel, Wi-Fi, academics, or facilities? Let us know below.'}
          </p>
        </div>
        {editingRequest && (
          <span className="badge badge-warning">Editing Mode</span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Student Name */}
          <div className="form-group">
            <label htmlFor="studentName">
              Student Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              placeholder="e.g. Ritweek Sharma"
              value={formData.studentName}
              onChange={handleChange}
              className={errors.studentName ? 'input-error' : ''}
              required
            />
            <span className="input-hint">{errors.studentName}</span>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Campus Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. student@campus.edu"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              required
            />
            <span className="input-hint">{errors.email}</span>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="IT & Wi-Fi">IT & Wi-Fi</option>
              <option value="Hostel">Hostel</option>
              <option value="Academic">Academic</option>
              <option value="Library">Library</option>
              <option value="Maintenance">Maintenance & Facilities</option>
              <option value="Mess & Cafeteria">Mess & Cafeteria</option>
              <option value="Other">Other</option>
            </select>
            <span className="input-hint">{errors.category}</span>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority">
              Priority Level <span className="required">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={errors.priority ? 'input-error' : ''}
              required
            >
              <option value="">-- Select Priority --</option>
              <option value="Low">Low - General inquiry</option>
              <option value="Medium">Medium - Normal request</option>
              <option value="High">High - Urgent attention</option>
              <option value="Urgent">Urgent - Critical / Emergency</option>
            </select>
            <span className="input-hint">{errors.priority}</span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="form-group full-width">
          <label htmlFor="problemDescription">
            Problem Description <span className="required">*</span>
          </label>
          <textarea
            id="problemDescription"
            name="problemDescription"
            rows="3"
            placeholder="Describe the issue in detail (location, what happened, when it started)..."
            value={formData.problemDescription}
            onChange={handleChange}
            className={errors.problemDescription ? 'input-error' : ''}
            required
          ></textarea>
          <span className="input-hint">{errors.problemDescription}</span>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <span className="btn-icon">
              {editingRequest ? '💾' : '📨'}
            </span>
            {isSubmitting
              ? 'Saving...'
              : editingRequest
              ? 'Update Request'
              : 'Submit Request'}
          </button>

          {editingRequest && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default RequestForm;
