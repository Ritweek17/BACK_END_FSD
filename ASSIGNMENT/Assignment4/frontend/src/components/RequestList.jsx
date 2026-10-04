import React from 'react';

/**
 * RequestList component renders the list of submitted campus requests,
 * along with filtering controls and action buttons for edit/delete.
 */
function RequestList({
  requests,
  loading,
  onEdit,
  onDelete,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory
}) {
  // Helper to get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'urgent':
        return 'badge-urgent';
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-category';
    }
  };

  // Filter requests based on dropdowns
  const filteredRequests = requests.filter((item) => {
    const matchPriority =
      filterPriority === 'ALL' || item.priority === filterPriority;
    const matchCategory =
      filterCategory === 'ALL' || item.category === filterCategory;
    return matchPriority && matchCategory;
  });

  return (
    <section className="requests-section">
      {/* Toolbar & Filters */}
      <div className="section-toolbar">
        <div className="toolbar-title-group">
          <h2 className="section-title">Submitted Campus Requests</h2>
          <span className="count-badge">
            {filteredRequests.length} Request
            {filteredRequests.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="toolbar-filters">
          <label htmlFor="filter-priority" className="filter-label">
            Filter Priority:
          </label>
          <select
            id="filter-priority"
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label htmlFor="filter-category" className="filter-label">
            Category:
          </label>
          <select
            id="filter-category"
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="IT & Wi-Fi">IT & Wi-Fi</option>
            <option value="Hostel">Hostel</option>
            <option value="Academic">Academic</option>
            <option value="Library">Library</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Mess & Cafeteria">Mess & Cafeteria</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p>Loading requests from server...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <div className="state-container empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Requests Found</h3>
          <p>No campus requests match your filter criteria or none have been submitted yet.</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredRequests.length > 0 && (
        <div className="requests-grid">
          {filteredRequests
            .slice()
            .reverse()
            .map((req) => {
              const dateString = req.createdAt
                ? new Date(req.createdAt).toLocaleString()
                : 'Recently';

              return (
                <div key={req.id} className="request-card">
                  <div className="request-card-header">
                    <div>
                      <div className="request-student">{req.studentName}</div>
                      <a href={`mailto:${req.email}`} className="request-email">
                        ✉️ {req.email}
                      </a>
                    </div>
                    <div className="request-tags">
                      <span className={`badge ${getPriorityBadgeClass(req.priority)}`}>
                        {req.priority}
                      </span>
                      <span className="badge badge-category">{req.category}</span>
                    </div>
                  </div>

                  <p className="request-desc">{req.problemDescription}</p>

                  <div className="request-footer">
                    <span className="request-date">📅 {dateString}</span>
                    <div className="request-actions">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => onEdit(req)}
                        title="Edit this request"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => onDelete(req.id)}
                        title="Delete this request"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}

export default RequestList;
