/**
 * WeatherIQ API Service
 * Communicates with the FastAPI backend at http://127.0.0.1:8000
 */

const BACKEND_URL = 'http://127.0.0.1:8000';

/** Shape returned by POST /route */
export interface RouteApiEdge {
  from: string;
  to: string;
  distance_km: number | null;
  weather: string;
  weather_penalty: number;
  edge_cost: number | null;
  temperature_c?: number;
}

export interface RouteApiResponse {
  source: string;
  destination: string;
  route: string[];
  route_display: string;
  edges: RouteApiEdge[];
  distance_km: number | null;
  total_weather_penalty: number | null;
  final_route_cost: number | null;
  start_coordinates: { latitude: number; longitude: number } | null;
  goal_coordinates: { latitude: number; longitude: number } | null;
  engine: string;
  expected_weather: string | null;
  travel_risk: string | null;
  recommendation: string | null;
  temperature_c?: number;
  weather: Array<{
    from: string;
    to: string;
    condition: string;
    weather_penalty: number;
    temperature_c?: number;
  }>;
}

/**
 * Plan a weather-aware route via the C++ backend.
 * Throws an Error with a descriptive message on failure.
 */
export async function planRoute(
  source: string,
  destination: string
): Promise<RouteApiResponse> {
  const response = await fetch(`${BACKEND_URL}/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, destination }),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail ?? detail;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(detail);
  }

  return response.json() as Promise<RouteApiResponse>;
}
