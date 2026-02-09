// Dashboard-specific JavaScript

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
  },
  {
    id: "INC-2023-00139",
    service: "CDN Edge",
    severity: "low",
    status: "open",
    created_at: "2023-10-14T18:20:00Z",
    description: "Cache miss rate increased by 15%"
  },
  {
    id: "INC-2023-00138",
    service: "Payment Processing",
    severity: "high",
    status: "acknowledged",
    created_at: "2023-10-14T10:05:00Z",
    description: "Transaction timeout errors"
  },
  {
    id: "INC-2023-00137",
    service: "Notification Service",
    severity: "medium",
    status: "resolved",
    created_at: "2023-10-13T16:40:00Z",
    description: "Email delivery delays"
  }
];

// DOM Elements
const summaryEl = document.getElementById('summary');
const dashboardEl = document.getElementById('dashboard');
const countdownEl = document.getElementById('countdown');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadIncidents();
  startAutoRefresh();
});

// Load incidents (with sample data as fallback)
async function loadIncidents() {
  try {
    // Try to fetch from API
    const response = await fetch("http://localhost:8001/api/v1/incidents");
    const incidents = await response.json();
    updateSummary(incidents);
    renderCards(incidents);
  } catch (err) {
    // Fallback to sample data if API is unavailable
    console.warn("API unavailable, using sample data:", err);
    updateSummary(sampleIncidents);
    renderCards(sampleIncidents);
  }
}

// Update summary statistics
function updateSummary(incidents) {
  const total = incidents.length;
  const open = incidents.filter(i => i.status === "open").length;
  const acknowledged = incidents.filter(i => i.status === "acknowledged").length;
  const resolved = incidents.filter(i => i.status === "resolved").length;

  // Calculate change percentages (mock data for demo)
  const openChange = open > 2 ? "+12%" : "-5%";
  const acknowledgedChange = acknowledged > 1 ? "+8%" : "-3%";
  const resolvedChange = resolved > 2 ? "+15%" : "-2%";

  summaryEl.innerHTML = `
    <div class="stat-card total">
      <div class="stat-header">
        <div class="stat-title">Total Incidents</div>
        <div class="stat-icon"><i class="fas fa-list-alt"></i></div>
      </div>
      <div class="stat-value">${total}</div>
      <div class="stat-change">Last 24h <span class="positive">+${Math.floor(total/2)}</span></div>
    </div>
    
    <div class="stat-card open">
      <div class="stat-header">
        <div class="stat-title">Open</div>
        <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
      </div>
      <div class="stat-value">${open}</div>
      <div class="stat-change ${openChange.startsWith('+') ? 'negative' : 'positive'}">${openChange} from yesterday</div>
    </div>
    
    <div class="stat-card acknowledged">
      <div class="stat-header">
        <div class="stat-title">Acknowledged</div>
        <div class="stat-icon"><i class="fas fa-user-check"></i></div>
      </div>
      <div class="stat-value">${acknowledged}</div>
      <div class="stat-change ${acknowledgedChange.startsWith('+') ? 'negative' : 'positive'}">${acknowledgedChange} from yesterday</div>
    </div>
    
    <div class="stat-card resolved">
      <div class="stat-header">
        <div class="stat-title">Resolved</div>
        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
      </div>
      <div class="stat-value">${resolved}</div>
      <div class="stat-change ${resolvedChange.startsWith('+') ? 'positive' : 'negative'}">${resolvedChange} from yesterday</div>
    </div>
  `;
}

// Render incident cards
function renderCards(incidents) {
  if (!incidents.length) {
    dashboardEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 4rem; color: var(--text-muted); margin-bottom: 20px;">
          <i class="far fa-check-circle"></i>
        </div>
        <h3>No Active Incidents</h3>
        <p style="color: var(--text-muted); max-width: 400px; margin: 10px auto;">
          All systems are operating normally. No incidents reported in the last 24 hours.
        </p>
      </div>
    `;
    return;
  }

  dashboardEl.innerHTML = incidents.map(incident => {
    // Format date
    const createdDate = new Date(incident.created_at);
    const timeAgo = getTimeAgo(createdDate);
    
    // Get appropriate severity class
    const severityClass = `severity-${incident.severity}`;
    
    // Get appropriate status class
    const statusClass = `status-${incident.status}`;
    
    return `
      <div class="incident-card">
        <div class="card-header">
          <div class="service-name">${incident.service}</div>
          <div class="incident-id">${incident.id}</div>
        </div>
        
        <div class="incident-details">
          <div class="detail-row">
            <div class="detail-label">Severity</div>
            <div class="detail-value">
              <span class="severity-badge ${severityClass}">${incident.severity}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Status</div>
            <div class="detail-value">
              <span class="status-badge ${statusClass}">
                <i class="fas ${getStatusIcon(incident.status)}"></i>
                ${incident.status}
              </span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Description</div>
            <div class="detail-value" style="max-width: 200px; text-align: right;">${incident.description}</div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="time-display">
            <i class="far fa-clock"></i>
            Created ${timeAgo}
          </div>
          <button class="action-btn" onclick="viewIncident('${incident.id}')">
            View Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
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
    default: return 'fa-question-circle';
  }
}

// Auto-refresh functionality
let countdown = 5;
let countdownInterval;

function startAutoRefresh() {
  countdownInterval = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      loadIncidents();
      countdown = 5;
    }
  }, 1000);
}

// View incident details (placeholder)
function viewIncident(id) {
  alert(`Viewing details for incident: ${id}\n\nIn a real application, this would open a detailed view or modal.`);
}

// Add refresh button functionality
document.addEventListener('DOMContentLoaded', function() {
  const refreshBtn = document.querySelector('.btn-secondary');
  if (refreshBtn && refreshBtn.textContent.includes('Filter')) {
    refreshBtn.addEventListener('click', () => {
      loadIncidents();
      countdown = 5; // Reset countdown on manual refresh
      countdownEl.textContent = countdown;
    });
  }
});