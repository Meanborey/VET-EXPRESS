# API Integration Guide

## Current Setup
The application now uses **Pinia** for state management with a structure ready for API integration.

## Files Created
- `types/route.ts` - TypeScript interfaces for routes
- `stores/useRoutesStore.ts` - Pinia store with dummy data structured as API response

## How to Switch to Real API

### 1. Update the `fetchRoutes()` action in `stores/useRoutesStore.ts`:

```typescript
async fetchRoutes() {
  this.loading = true;
  this.error = null;

  try {
    // Replace the dummy data call with your actual API endpoint
    const response = await $fetch<RouteApiResponse>('/api/routes');
    
    this.localRoutes = response.localRoutes;
    this.internationalRoutes = response.internationalRoutes;
  } catch (err) {
    this.error = err instanceof Error ? err.message : 'Failed to fetch routes';
    console.error('Error fetching routes:', err);
  } finally {
    this.loading = false;
  }
}
```

### 2. Create your API endpoint (example using Nuxt server API):

Create `server/api/routes.ts`:

```typescript
export default defineEventHandler(async (event) => {
  // Your API logic here
  const data = await fetch('YOUR_BACKEND_API_URL/routes');
  const routes = await data.json();
  
  return routes;
});
```

### 3. Backend API Expected Response Format:

```json
{
  "localRoutes": [
    {
      "id": 1,
      "name": "Phnom Penh - Siem Reap",
      "slug": "phnom-penh-siem-reap"
    }
  ],
  "internationalRoutes": [
    {
      "id": 1,
      "name": "Phnom Penh - Bangkok",
      "slug": "phnom-penh-bangkok"
    }
  ]
}
```

## Features Implemented
- ✅ Pinia store with proper state management
- ✅ Loading and error states
- ✅ TypeScript interfaces for type safety
- ✅ Dummy data structured as API response
- ✅ Component updated to use store
- ✅ Ready for real API integration

## Usage
The component automatically fetches routes when mounted. The store can be used in other components:

```typescript
import { useRoutesStore } from '~/stores/useRoutesStore';

const routesStore = useRoutesStore();
// Access data: routesStore.getAllLocalRoutes
// Check loading: routesStore.isLoading
// Refresh data: routesStore.fetchRoutes()
```
