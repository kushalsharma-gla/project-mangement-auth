// Enable tooltips
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Fade out alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });
  
  // Format dates for better display
  const formatDates = () => {
    const dates = document.querySelectorAll('.format-date');
    dates.forEach(element => {
      const date = new Date(element.textContent);
      element.textContent = date.toLocaleDateString();
    });
  };
  
  formatDates();
});