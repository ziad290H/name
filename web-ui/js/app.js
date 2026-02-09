// Shared functionality across all pages

// Sample data for demonstration
const sampleIncidents = [
  {
    id: "INC-2023-00142",
    service: "API Gateway",
    severity: "high",
    status: "open",
    created_at: "2023-10-15T14:30:00Z",
    description: "Increased latency across all endpoints"
  },
  {
    id: "INC-2023-00141",
    service: "Database Cluster",
    severity: "critical",
    status: "acknowledged",
    created_at: "2023-10-15T12:15:00Z",
    description: "Primary node failure detected"
  },
  {
    id: "INC-2023-00140",
    service: "Authentication Service",
    severity: "medium",
    status: "resolved",
    created_at: "2023-10-14T22:45:00Z",
    description: "Intermittent login failures"
  }
];

const sampleServices = [
  {
    id: "SVC-001",
    name: "API Gateway",
    status: "healthy",
    uptime: "99.95%",
    latency: "45ms",
    lastIncident: "2 days ago"
  },
  {
    id: "SVC-002",
    name: "Database Cluster",
    status: "degraded",
    uptime: "99.87%",
    latency: "120ms",
    lastIncident: "5 hours ago"
  },
  {
    id: "SVC-003",
    name: "Authentication Service",
    status: "healthy",
    uptime: "99.98%",
    latency: "28ms",
    lastIncident: "1 week ago"
  }
];

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

// Helper function to get status icon
function getStatusIcon(status) {
  switch(status) {
    case 'open': return 'fa-exclamation-circle';
    case 'acknowledged': return 'fa-user-check';
    case 'resolved': return 'fa-check-circle';
    case 'healthy': return 'fa-check-circle';
    case 'degraded': return 'fa-exclamation-triangle';
    case 'down': return 'fa-times-circle';
    default: return 'fa-question-circle';
  }
}

// Get status color
function getStatusColor(status) {
  switch(status) {
    case 'open': return 'var(--open)';
    case 'acknowledged': return 'var(--acknowledged)';
    case 'resolved': return 'var(--resolved)';
    case 'healthy': return 'var(--success)';
    case 'degraded': return 'var(--warning)';
    case 'down': return 'var(--danger)';
    default: return 'var(--text-muted)';
  }
}

// Set active navigation item based on current page
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  
  // Initialize tooltips if any
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
});

// Tooltip functions
function showTooltip(e) {
  const tooltipText = e.target.getAttribute('data-tooltip');
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = tooltipText;
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'var(--bg-secondary)';
  tooltip.style.color = 'var(--text-primary)';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '0.75rem';
  tooltip.style.zIndex = '1000';
  tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  tooltip.style.border = '1px solid var(--border-color)';
  
  document.body.appendChild(tooltip);
  
  const rect = e.target.getBoundingClientRect();
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
  tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
  
  e.target.tooltipElement = tooltip;
}

function hideTooltip(e) {
  if (e.target.tooltipElement) {
    e.target.tooltipElement.remove();
  }
}

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 20px';
  toast.style.background = type === 'success' ? 'var(--success)' : 
                          type === 'error' ? 'var(--danger)' : 
                          type === 'warning' ? 'var(--warning)' : 'var(--primary)';
  toast.style.color = 'white';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '10000';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  toast.style.animation = 'slideIn 0.3s ease';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);