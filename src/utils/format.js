/**
 * Format time from Date object to HH:MM format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted time (HH:MM)
 */
export const formatTime = (date) => {
  if (!date) return '-';
  try {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (err) {
    return '-';
  }
};

/**
 * Convert Date to YYYY-MM-DD format
 * @param {Date} date - Date object
 * @returns {string} Formatted date (YYYY-MM-DD)
 */
export const dateToYYYYMMDD = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (err) {
    return '';
  }
};

/**
 * Compute duration display between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Duration display (e.g., "8.5 hrs" or "45 mins")
 */
export const computeDurationDisplay = (startDate, endDate) => {
  if (!startDate || !endDate) return '-';
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours >= 1) {
      return `${diffHours.toFixed(1)} hrs`;
    } else {
      const diffMins = Math.round(diffMs / (1000 * 60));
      return `${diffMins} mins`;
    }
  } catch (err) {
    return '-';
  }
};

/**
 * Format date to readable format (e.g., "Nov 29, 2025")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '-';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (err) {
    return '-';
  }
};

/**
 * Format date and time together (e.g., "Nov 29, 2025 2:30 PM")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return '-';
  }
};

/**
 * Get status color based on attendance status
 * @param {string} status - Attendance status (present, absent, late, half-day)
 * @returns {string} Color code or class name
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'present':
      return '#27ae60'; // green
    case 'absent':
      return '#e74c3c'; // red
    case 'late':
      return '#f39c12'; // yellow
    case 'half-day':
      return '#e67e22'; // orange
    default:
      return '#95a5a6'; // gray
  }
};

/**
 * Get status badge class name
 * @param {string} status - Attendance status
 * @returns {string} Badge class name
 */
export const getStatusBadgeClass = (status) => {
  return `badge-${status.replace('-', '-')}`;
};
