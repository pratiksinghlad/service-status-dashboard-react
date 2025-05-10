# **App Name**: HealthCheck Central

## Core Features:

- Environment Toggle: Environment selection using a dropdown (Dev/Stage/Prod), with persistent storage.
- Dashboard Overview: Dashboard summary cards for total APIs, healthy count, and unhealthy count.
- Add API Endpoint: Add new API endpoints with name, URL, and environment (using IndexedDB).
- Health Status Display: Display API name, response time, status code, last check timestamp, and health indicator using MUI cards.
- Detailed Status View: Popup with detailed status, health check sources, error messages, and service-specific metrics.

## Style Guidelines:

- Primary color: Dark blue (#1A202C) for a professional look.
- Secondary color: Light gray (#E2E8F0) for backgrounds and card separators.
- Accent: Teal (#00B5D8) for interactive elements and highlights.
- Responsive, desktop-focused layout filling the entire page.
- Simple, clear icons to represent API health status (green check/red cross).
- Subtle transitions for loading states and status updates.