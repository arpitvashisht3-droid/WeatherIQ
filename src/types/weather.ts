export type TemperatureUnit = 'C' | 'F';

export type WeatherCondition = 
  | 'sunny' 
  | 'partly_cloudy' 
  | 'cloudy' 
  | 'rainy' 
  | 'thunderstorm' 
  | 'snowy' 
  | 'foggy';

export interface CityLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface CurrentWeather {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: WeatherCondition;
  conditionLabel: string;
  visibilityKm: number;
  humidityPercent: number;
  uvIndex: number;
  windKmH: number;
  windDirection: string;
  pressureHpa: number;
  dewPointC: number;
}

export interface AirQuality {
  aqi: number;
  label: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy';
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  statusColor: string;
}

export interface HourlyPoint {
  time: string; // e.g. "08:00"
  label: string; // e.g. "8 AM"
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  tempC: number;
  tempF: number;
  condition: WeatherCondition;
  precipChancePercent: number;
  windKmH: number;
  humidityPercent: number;
  suitabilityScore: number; // 0 - 100 for activities
}

export interface DailyForecast {
  day: string; // e.g. "Mon"
  fullDayName: string; // e.g. "Monday"
  date: string; // e.g. "Jul 27"
  condition: WeatherCondition;
  conditionLabel: string;
  tempHighC: number;
  tempHighF: number;
  tempLowC: number;
  tempLowF: number;
  precipChancePercent: number;
  humidityPercent: number;
  windKmH?: number;
  summary: string;
}

export type AlertSeverity = 'severe' | 'moderate' | 'info';

export interface SmartAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  time: string;
  affectedArea: string;
  recommendation: string;
  iconName: string;
}

export interface Recommendation {
  id: string;
  category: 'running' | 'cycling' | 'ev' | 'solar' | 'outdoor' | 'travel';
  title: string;
  insight: string;
  status: 'Optimal' | 'Favorable' | 'Caution' | 'Avoid';
  badgeColor: string;
  detailText: string;
  metric?: string;
}

export interface RouteWaypoint {
  id: string;
  name: string;
  distanceFromStartKm: number;
  tempC: number;
  tempF: number;
  condition: WeatherCondition;
  conditionLabel: string;
  hasAlert: boolean;
  alertText?: string;
  mapXPercent: number; // For plotting on stylized map background
  mapYPercent: number;
}

export interface RoutePlan {
  origin: string;
  destination: string;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  overallHazardLevel: 'Low' | 'Moderate' | 'High';
  waypoints: RouteWaypoint[];
}

export type ActivityType = 
  | 'Cricket' 
  | 'Running' 
  | 'Cycling' 
  | 'Outdoor Photography' 
  | 'Drone Flying' 
  | 'Solar Generation' 
  | 'Tennis' 
  | 'Lawn Mowing' 
  | 'Beach Visit';

export interface TimeWindowResult {
  activity: ActivityType;
  durationHours: number;
  bestStartTime: string;
  bestEndTime: string;
  score: number; // 0-100
  reason: string;
  hourlyScores: { time: string; tempC: number; rainChance: number; humidity: number; score: number }[];
}

export interface TomorrowForecast {
  locationName: string;
  tempHighC: number;
  tempLowC: number;
  conditionLabel: string;
  condition: WeatherCondition;
  summary: string;
  outfitRecommendation: string;
  travelTip: string;
}

export interface FullLocationWeather {
  location: CityLocation;
  current: CurrentWeather;
  airQuality: AirQuality;
  hourly: HourlyPoint[];
  daily: DailyForecast[];
  tomorrow: TomorrowForecast;
  alerts: SmartAlert[];
  recommendations: Recommendation[];
  routes: RoutePlan[];
}
