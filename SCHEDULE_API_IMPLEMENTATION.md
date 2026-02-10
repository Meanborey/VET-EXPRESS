# Schedule API Integration Guide

## Overview
This document describes the implementation of schedule data fetching from the API endpoint `api/schedule/listByDate` and displaying it in the `cardlistschedule` component.

## Files Modified/Created

### 1. Created Store: `stores/useScheduleStore.ts`
A Pinia store to manage schedule data with the following features:
- **State Management**: Handles schedules list, loading states, and errors
- **API Integration**: Fetches data from `api/schedule/listByDate`
- **Data Transformation**: Transforms API response to match component requirements
- **Error Handling**: Comprehensive error handling with user-friendly messages

#### Key Actions:
- `fetchSchedulesByDate(date, destinationFrom, destinationTo, nationally, type, session?)` - Fetches schedules from API
- `clearSchedules()` - Clears schedule data
- `getScheduleById(id)` - Gets a specific schedule by ID
- `calculateDuration()` - Calculates trip duration between departure and arrival times

### 2. Updated Component: `components/common/tick-booking/schedulelist.vue`
Enhanced to fetch and display schedule data with:
- **Loading State**: Shows spinner while fetching data
- **Error State**: Displays error message with retry button
- **Empty State**: Shows message when no schedules are available
- **Schedule Display**: Renders schedules using `cardlistschedule` component

### 3. Updated Types: `types/api.ts`
Added missing fields to `ApiSchedule` interface:
- `vehicleImage`: Vehicle image URL
- `vehicleIcon`: Vehicle icon URL
- `routeInfo`: Route information text

## API Configuration

### Environment Variables (.env)
The API configuration is set in the environment:
```env
NUXT_PUBLIC_API_BASE_URL=https://qacltom.udaya-tech.com/vetTkWBusApi
NUXT_PUBLIC_API_TOKEN=ade765b5-0644-47df-90fb-fc91b89b3dba
```

These are configured in `nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://qacltom.udaya-tech.com/vetTkWBusApi',
    apiToken: process.env.NUXT_PUBLIC_API_TOKEN || 'ade765b5-0644-47df-90fb-fc91b89b3dba'
  }
}
```

## API Endpoint

### POST `/api/schedule/listByDate`

**Request Body (form-urlencoded):**
```
date: string (required) - Format: YYYY-MM-DD
destinationFrom: string (required) - Origin location ID
destinationTo: string (required) - Destination location ID
nationally: string (required) - Nationally type (e.g., 'local', 'international')
type: string (required) - Vehicle/trip type
session: string (optional) - Session parameter
```

**Response Format:**
```typescript
{
  header: {
    result: boolean,
    statusCode: number,
    message?: string
  },
  body: ApiSchedule[] | 0  // 0 when no data
}
```

**ApiSchedule Structure:**
```typescript
{
  id: string | number
  vehicleName: string
  vehicleType: string
  vehicleImage?: string
  vehicleIcon?: string
  departureTime: string  // Format: HH:MM
  arrivalTime: string    // Format: HH:MM
  duration?: string
  availableSeats: number
  totalSeats: number
  originalPrice: number
  price: number
  origin: string
  destination: string
  departDate: string
  routeInfo?: string
  boardingPoint?: string
  dropOffPoint?: string
  seatLayout?: string
  unavailableSeats?: string[]
}
```

## Usage

### In Component
```vue
<script setup>
import { useScheduleStore } from '~/stores/useScheduleStore'

const scheduleStore = useScheduleStore()

// Fetch schedules
await scheduleStore.fetchSchedulesByDate(
  '2026-01-30',      // date
  'origin123',       // destinationFrom
  'dest456',         // destinationTo
  'local',           // nationally
  'bus',             // type
  'morning'          // session (optional)
)

// Access data
const schedules = computed(() => scheduleStore.getAllSchedules)
const isLoading = computed(() => scheduleStore.isLoading)
const hasError = computed(() => scheduleStore.hasError)
</script>
```

### URL Query Parameters
The schedule list page expects these query parameters:
- `from`: Origin location name (for display)
- `to`: Destination location name (for display)
- `departDate`: Departure date (YYYY-MM-DD)
- `destinationFrom`: Origin location ID (for API call) - **Required**
- `destinationTo`: Destination location ID (for API call) - **Required**
- `nationally`: Nationally type (local/international) - **Required**
- `type`: Vehicle/trip type - **Required**
- `session`: Session parameter (optional)
- `returnDate`: (Optional) Return date

Example:
```
/schedulelist?from=Phnom%20Penh&to=Siem%20Reap&departDate=2026-01-30&destinationFrom=1&destinationTo=2&nationally=local&type=bus
```

## Features Implemented

✅ **API Integration**
- Fetches real schedule data from backend
- Uses `useApi()` composable for API calls
- Handles form-urlencoded requests with Bearer token

✅ **State Management**
- Centralized schedule data in Pinia store
- Loading, error, and empty states
- Reactive data updates

✅ **Error Handling**
- User-friendly error messages
- Retry functionality
- Graceful handling of empty data (API returns 0)

✅ **UI States**
- Loading spinner during data fetch
- Error display with retry button
- Empty state message when no schedules found
- Schedule cards display when data available

✅ **Data Transformation**
- Calculates duration if not provided by API
- Sets default values for optional fields
- Transforms API response to component format

✅ **Type Safety**
- TypeScript interfaces for all data structures
- Proper type checking throughout

## Next Steps

To further enhance the implementation:

1. **Add Filtering**: Add filters for price, departure time, etc.
2. **Sorting**: Allow sorting by price, time, duration
3. **Caching**: Implement data caching to reduce API calls
4. **Pagination**: Add pagination if there are many schedules
5. **Real-time Updates**: Use WebSocket for live availability updates
6. **Favorites**: Allow users to save favorite routes

## Testing

To test the implementation:

1. Navigate to the schedule list page with proper query parameters
2. Verify loading state appears initially
3. Check that schedules display correctly with all fields
4. Test error state by providing invalid IDs
5. Test empty state by searching for unavailable routes
6. VerifydestinationFrom and destinationTo are provided
- Ensure date format is correct (YYYY-MM-DD)
- Verify nationally and type parameters are provided

## Troubleshooting

**No schedules showing:**
- Check console for API errors
- Verify originId and destinationId are provided
- Ensure date format is correct (YYYY-MM-DD)
- Check API credentials in .env

**API errors:**
- Verify API base URL is correct
- Check API token is valid
- Ensure network connectivity
- Check API response format matches expected structure

**Type errors:**
- Ensure all required fields in ApiSchedule are present
- Check that API response structure matches interface
- Verify data transformation in store is correct
