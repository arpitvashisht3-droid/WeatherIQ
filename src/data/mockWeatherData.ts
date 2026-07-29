import { 
  FullLocationWeather, 
  CityLocation, 
  ActivityType, 
  TimeWindowResult, 
  HourlyPoint 
} from '../types/weather';

export const CITIES: CityLocation[] = [
  { id: 'mum', name: 'Mumbai', region: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, isDefault: true },
  { id: 'blr', name: 'Bengaluru', region: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
  { id: 'del', name: 'New Delhi', region: 'Delhi NCR', country: 'India', lat: 28.6139, lng: 77.2090 },
  { id: 'ccu', name: 'Kolkata', region: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639 },
  { id: 'maa', name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
  { id: 'hyd', name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 },
  { id: 'jpr', name: 'Jaipur', region: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
];

export const MOCK_WEATHER_DATA: Record<string, FullLocationWeather> = {
  mum: {
    location: CITIES[0],
    current: {
      tempC: 28,
      tempF: 82,
      feelsLikeC: 31,
      feelsLikeF: 88,
      condition: 'partly_cloudy',
      conditionLabel: 'Partly Cloudy & Humid',
      visibilityKm: 10,
      humidityPercent: 78,
      uvIndex: 7,
      windKmH: 16,
      windDirection: 'SW',
      pressureHpa: 1011,
      dewPointC: 23,
    },
    airQuality: {
      aqi: 42,
      label: 'Good',
      pm25: 11.2,
      pm10: 18.5,
      o3: 24.0,
      no2: 15.0,
      statusColor: '#22c55e',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 25, tempF: 77, condition: 'sunny', precipChancePercent: 10, windKmH: 10, humidityPercent: 82, suitabilityScore: 92 },
      { time: '07:00 AM', label: '07:00 AM', period: 'Morning', tempC: 26, tempF: 79, condition: 'sunny', precipChancePercent: 10, windKmH: 11, humidityPercent: 80, suitabilityScore: 95 },
      { time: '08:00 AM', label: '08:00 AM', period: 'Morning', tempC: 27, tempF: 81, condition: 'sunny', precipChancePercent: 10, windKmH: 12, humidityPercent: 79, suitabilityScore: 98 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 28, tempF: 82, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 14, humidityPercent: 78, suitabilityScore: 90 },
      { time: '10:00 AM', label: '10:00 AM', period: 'Morning', tempC: 29, tempF: 84, condition: 'partly_cloudy', precipChancePercent: 20, windKmH: 15, humidityPercent: 76, suitabilityScore: 86 },
      { time: '11:00 AM', label: '11:00 AM', period: 'Morning', tempC: 30, tempF: 86, condition: 'partly_cloudy', precipChancePercent: 25, windKmH: 16, humidityPercent: 75, suitabilityScore: 82 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 31, tempF: 88, condition: 'partly_cloudy', precipChancePercent: 25, windKmH: 18, humidityPercent: 74, suitabilityScore: 78 },
      { time: '01:00 PM', label: '01:00 PM', period: 'Afternoon', tempC: 31, tempF: 88, condition: 'sunny', precipChancePercent: 20, windKmH: 19, humidityPercent: 73, suitabilityScore: 75 },
      { time: '02:00 PM', label: '02:00 PM', period: 'Afternoon', tempC: 30, tempF: 86, condition: 'sunny', precipChancePercent: 15, windKmH: 20, humidityPercent: 75, suitabilityScore: 72 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 29, tempF: 84, condition: 'partly_cloudy', precipChancePercent: 30, windKmH: 21, humidityPercent: 77, suitabilityScore: 76 },
      { time: '04:00 PM', label: '04:00 PM', period: 'Afternoon', tempC: 28, tempF: 82, condition: 'partly_cloudy', precipChancePercent: 35, windKmH: 19, humidityPercent: 79, suitabilityScore: 84 },
      { time: '05:00 PM', label: '05:00 PM', period: 'Evening', tempC: 27, tempF: 81, condition: 'rainy', precipChancePercent: 60, windKmH: 18, humidityPercent: 82, suitabilityScore: 70 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 27, tempF: 81, condition: 'partly_cloudy', precipChancePercent: 40, windKmH: 16, humidityPercent: 83, suitabilityScore: 88 },
      { time: '07:00 PM', label: '07:00 PM', period: 'Evening', tempC: 26, tempF: 79, condition: 'sunny', precipChancePercent: 20, windKmH: 14, humidityPercent: 84, suitabilityScore: 89 },
      { time: '08:00 PM', label: '08:00 PM', period: 'Night', tempC: 26, tempF: 79, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 12, humidityPercent: 85, suitabilityScore: 80 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 25, tempF: 77, condition: 'partly_cloudy', precipChancePercent: 10, windKmH: 10, humidityPercent: 86, suitabilityScore: 72 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 30, tempHighF: 86, tempLowC: 25, tempLowF: 77, precipChancePercent: 25, humidityPercent: 78, windKmH: 16, summary: 'Coastal sea breeze along Marine Drive with afternoon cloud cover' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'rainy', conditionLabel: 'Monsoon Showers', tempHighC: 27, tempHighF: 81, tempLowC: 24, tempLowF: 75, precipChancePercent: 70, humidityPercent: 88, windKmH: 22, summary: 'Intermittent rainfall expected across Western Suburbs after 03:00 PM' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'sunny', conditionLabel: 'Clear Skies', tempHighC: 31, tempHighF: 88, tempLowC: 25, tempLowF: 77, precipChancePercent: 10, humidityPercent: 70, windKmH: 14, summary: 'Bright sunny day with low precipitation risk' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Warm & Humid', tempHighC: 32, tempHighF: 90, tempLowC: 26, tempLowF: 79, precipChancePercent: 5, humidityPercent: 68, windKmH: 12, summary: 'High heat index and strong UV radiation around noon' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 29, tempHighF: 84, tempLowC: 24, tempLowF: 75, precipChancePercent: 20, humidityPercent: 75, summary: 'Comfortable evening breeze along Bandra Bandstand' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'cloudy', conditionLabel: 'Overcast Skies', tempHighC: 28, tempHighF: 82, tempLowC: 24, tempLowF: 75, precipChancePercent: 35, humidityPercent: 80, summary: 'Cloudy conditions keeping temperatures moderate' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Sunny Weekend', tempHighC: 30, tempHighF: 86, tempLowC: 25, tempLowF: 77, precipChancePercent: 15, humidityPercent: 74, summary: 'Ideal weather for outdoor activities and travel' },
    ],
    tomorrow: {
      locationName: 'Mumbai, India',
      tempHighC: 27,
      tempLowC: 24,
      conditionLabel: 'Monsoon Showers in Evening',
      condition: 'rainy',
      summary: 'Pleasant morning followed by light to moderate monsoon showers (70% chance) after 03:00 PM IST.',
      outfitRecommendation: 'Waterproof raincoat or compact umbrella with quick-dry footwear.',
      travelTip: 'Traffic on Western Express Highway & WEH flyovers may slow during peak evening rush.',
    },
    alerts: [
      {
        id: 'alt-mum-1',
        type: 'Monsoon Shower Alert',
        severity: 'moderate',
        title: 'Moderate Monsoon Rain & Slippery Roads',
        description: 'Intermittent precipitation expected between 03:00 PM and 08:00 PM IST.',
        time: 'Today 03:00 PM - 08:00 PM IST',
        affectedArea: 'Western Express Highway, Bandra-Worli Sea Link & WEH',
        recommendation: 'Allow 15-20 extra minutes for commute. Maintain safe braking distance on wet roads.',
        iconName: 'CloudRain',
      },
      {
        id: 'alt-mum-2',
        type: 'UV Index Peak',
        severity: 'info',
        title: 'High UV Radiation (Level 7)',
        description: 'Peak solar radiation between 11:30 AM and 02:30 PM IST.',
        time: 'Today 11:30 AM - 02:30 PM IST',
        affectedArea: 'Coastal promenades & open urban areas',
        recommendation: 'Apply SPF 30+ sunscreen if outdoors longer than 20 minutes.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-mum-1',
        category: 'running',
        title: 'Morning Marine Drive Run',
        insight: 'Optimal window 06:00 AM – 08:30 AM IST. Cool 25°C temperature with fresh ocean breeze.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Heart rate efficiency is highest in cool morning air before coastal humidity peaks.',
        metric: '98% Suitability',
      },
      {
        id: 'rec-mum-2',
        category: 'outdoor',
        title: 'Cricket Match Window',
        insight: 'Best ground slot 07:00 AM – 10:30 AM IST before afternoon rain probabilities rise.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Dry outfield and pleasant wind speeds ensure smooth play at Oval Maidan / Cross Maidan.',
        metric: '94% Suitability',
      },
      {
        id: 'rec-mum-3',
        category: 'ev',
        title: 'EV Battery Range',
        insight: 'Ambient temperature (28°C) delivers near-optimal battery efficiency (+4%).',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Minimal cabin A/C load needed in early hours, conserving battery range.',
        metric: '+4% Range Bonus',
      },
      {
        id: 'rec-mum-4',
        category: 'solar',
        title: 'Rooftop Solar Harvest',
        insight: 'Estimated 32.5 kWh daily photovoltaic yield under morning solar exposure.',
        status: 'Optimal',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        detailText: 'Peak generation window expected between 10:30 AM and 02:30 PM IST.',
        metric: '32.5 kWh Output',
      },
    ],
    routes: [
      {
        origin: 'Mumbai CST (South Mumbai)',
        destination: 'Navi Mumbai (Vashi)',
        totalDistanceKm: 28,
        totalDurationMinutes: 42,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-m1', name: 'Fort / Fort CBD', distanceFromStartKm: 0, tempC: 28, tempF: 82, condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', hasAlert: false, mapXPercent: 18, mapYPercent: 28 },
          { id: 'wp-m2', name: 'Eastern Freeway Corridor', distanceFromStartKm: 12, tempC: 28, tempF: 82, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 42, mapYPercent: 48 },
          { id: 'wp-m3', name: 'Chembur Naka', distanceFromStartKm: 20, tempC: 29, tempF: 84, condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', hasAlert: false, mapXPercent: 65, mapYPercent: 62 },
          { id: 'wp-m4', name: 'Vashi Bridge Plaza', distanceFromStartKm: 28, tempC: 29, tempF: 84, condition: 'sunny', conditionLabel: 'Clear Sky', hasAlert: true, alertText: 'Crosswind 18 km/h over bridge', mapXPercent: 82, mapYPercent: 78 },
        ],
      },
      {
        origin: 'Bandra West',
        destination: 'Thane City',
        totalDistanceKm: 32,
        totalDurationMinutes: 50,
        overallHazardLevel: 'Moderate',
        waypoints: [
          { id: 'wp-m21', name: 'Bandra Reclamation', distanceFromStartKm: 0, tempC: 28, tempF: 82, condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', hasAlert: false, mapXPercent: 22, mapYPercent: 32 },
          { id: 'wp-m22', name: 'Andheri WEH Flyover', distanceFromStartKm: 12, tempC: 29, tempF: 84, condition: 'rainy', conditionLabel: 'Light Showers', hasAlert: true, alertText: 'Wet asphalt & slowing traffic', mapXPercent: 52, mapYPercent: 52 },
          { id: 'wp-m23', name: 'Thane Majiwada', distanceFromStartKm: 32, tempC: 28, tempF: 82, condition: 'partly_cloudy', conditionLabel: 'Cloudy', hasAlert: false, mapXPercent: 80, mapYPercent: 72 },
        ],
      },
    ],
  },

  blr: {
    location: CITIES[1],
    current: {
      tempC: 22,
      tempF: 72,
      feelsLikeC: 22,
      feelsLikeF: 72,
      condition: 'partly_cloudy',
      conditionLabel: 'Pleasant & Breezy',
      visibilityKm: 12,
      humidityPercent: 62,
      uvIndex: 6,
      windKmH: 14,
      windDirection: 'E',
      pressureHpa: 1015,
      dewPointC: 15,
    },
    airQuality: {
      aqi: 28,
      label: 'Good',
      pm25: 6.8,
      pm10: 12.1,
      o3: 20.0,
      no2: 10.5,
      statusColor: '#22c55e',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 18, tempF: 64, condition: 'sunny', precipChancePercent: 5, windKmH: 10, humidityPercent: 72, suitabilityScore: 96 },
      { time: '08:00 AM', label: '08:00 AM', period: 'Morning', tempC: 20, tempF: 68, condition: 'sunny', precipChancePercent: 5, windKmH: 12, humidityPercent: 66, suitabilityScore: 98 },
      { time: '10:00 AM', label: '10:00 AM', period: 'Morning', tempC: 22, tempF: 72, condition: 'partly_cloudy', precipChancePercent: 10, windKmH: 14, humidityPercent: 62, suitabilityScore: 92 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 24, tempF: 75, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 15, humidityPercent: 58, suitabilityScore: 88 },
      { time: '02:00 PM', label: '02:00 PM', period: 'Afternoon', tempC: 25, tempF: 77, condition: 'sunny', precipChancePercent: 10, windKmH: 16, humidityPercent: 55, suitabilityScore: 85 },
      { time: '04:00 PM', label: '04:00 PM', period: 'Afternoon', tempC: 24, tempF: 75, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 14, humidityPercent: 60, suitabilityScore: 90 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 22, tempF: 72, condition: 'sunny', precipChancePercent: 10, windKmH: 12, humidityPercent: 65, suitabilityScore: 94 },
      { time: '08:00 PM', label: '08:00 PM', period: 'Night', tempC: 20, tempF: 68, condition: 'partly_cloudy', precipChancePercent: 5, windKmH: 10, humidityPercent: 70, suitabilityScore: 88 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'partly_cloudy', conditionLabel: 'Pleasant & Breezy', tempHighC: 25, tempHighF: 77, tempLowC: 18, tempLowF: 64, precipChancePercent: 10, humidityPercent: 62, windKmH: 14, summary: 'Cool morning followed by mild breezy afternoon' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'sunny', conditionLabel: 'Clear Blue', tempHighC: 26, tempHighF: 79, tempLowC: 18, tempLowF: 64, precipChancePercent: 5, humidityPercent: 58, windKmH: 12, summary: 'Clear sunshine with low humidity across Silicon Plateau' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'rainy', conditionLabel: 'Passing Drizzle', tempHighC: 23, tempHighF: 73, tempLowC: 17, tempLowF: 63, precipChancePercent: 50, humidityPercent: 75, windKmH: 18, summary: 'Light scattered evening showers around Indiranagar & Koramangala' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Bright & Mild', tempHighC: 25, tempHighF: 77, tempLowC: 18, tempLowF: 64, precipChancePercent: 5, humidityPercent: 60, summary: 'Ideal working weather with gentle easterly breeze' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 24, tempHighF: 75, tempLowC: 17, tempLowF: 63, precipChancePercent: 20, humidityPercent: 64, summary: 'Mild cloud cover keeping temperatures comfortable' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'sunny', conditionLabel: 'Sunny Skies', tempHighC: 26, tempHighF: 79, tempLowC: 18, tempLowF: 64, precipChancePercent: 10, humidityPercent: 59, summary: 'Great conditions for evening outdoor dining' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Clear Weekend', tempHighC: 27, tempHighF: 81, tempLowC: 19, tempLowF: 66, precipChancePercent: 5, humidityPercent: 56, summary: 'Perfect weekend weather for Cubbon Park visits' },
    ],
    tomorrow: {
      locationName: 'Bengaluru, India',
      tempHighC: 26,
      tempLowC: 18,
      conditionLabel: 'Clear & Sunny',
      condition: 'sunny',
      summary: 'Crisp morning air around 18°C warming to a comfortable 26°C with low wind.',
      outfitRecommendation: 'Light cotton attire or a light jacket for early morning hours.',
      travelTip: 'Smooth commuting expected across Electronic City Expressway.',
    },
    alerts: [
      {
        id: 'alt-blr-1',
        type: 'Optimal Weather Alert',
        severity: 'info',
        title: 'Ideal Atmospheric Comfort Score',
        description: 'Humidity 62% and temperatures 22°C offer excellent outdoor comfort today.',
        time: 'Today All Day IST',
        affectedArea: 'Bengaluru Urban & Rural',
        recommendation: 'Ideal time for outdoor walks, sports, and solar power generation.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-blr-1',
        category: 'running',
        title: 'Cubbon Park Morning Jog',
        insight: 'Best window 06:00 AM – 09:00 AM IST. Cool 18°C temperature with crisp air quality.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'AQI index of 28 makes early morning running exceptionally healthy.',
        metric: '99% Suitability',
      },
    ],
    routes: [
      {
        origin: 'MG Road (CBD)',
        destination: 'Electronic City Phase 1',
        totalDistanceKm: 18,
        totalDurationMinutes: 30,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-b1', name: 'MG Road Metro Hub', distanceFromStartKm: 0, tempC: 22, tempF: 72, condition: 'partly_cloudy', conditionLabel: 'Pleasant', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-b2', name: 'Silk Board Junction', distanceFromStartKm: 10, tempC: 23, tempF: 73, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-b3', name: 'Electronic City Toll', distanceFromStartKm: 18, tempC: 24, tempF: 75, condition: 'sunny', conditionLabel: 'Clear', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },

  del: {
    location: CITIES[2],
    current: {
      tempC: 34,
      tempF: 93,
      feelsLikeC: 38,
      feelsLikeF: 100,
      condition: 'sunny',
      conditionLabel: 'Hot & Clear',
      visibilityKm: 8,
      humidityPercent: 55,
      uvIndex: 9,
      windKmH: 12,
      windDirection: 'NW',
      pressureHpa: 1004,
      dewPointC: 22,
    },
    airQuality: {
      aqi: 98,
      label: 'Moderate',
      pm25: 35.4,
      pm10: 68.2,
      o3: 52.0,
      no2: 38.0,
      statusColor: '#eab308',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 28, tempF: 82, condition: 'sunny', precipChancePercent: 0, windKmH: 8, humidityPercent: 65, suitabilityScore: 85 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 31, tempF: 88, condition: 'sunny', precipChancePercent: 0, windKmH: 10, humidityPercent: 60, suitabilityScore: 78 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 35, tempF: 95, condition: 'sunny', precipChancePercent: 5, windKmH: 13, humidityPercent: 52, suitabilityScore: 60 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 36, tempF: 97, condition: 'sunny', precipChancePercent: 5, windKmH: 15, humidityPercent: 48, suitabilityScore: 55 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 32, tempF: 90, condition: 'partly_cloudy', precipChancePercent: 10, windKmH: 11, humidityPercent: 58, suitabilityScore: 75 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 29, tempF: 84, condition: 'sunny', precipChancePercent: 0, windKmH: 8, humidityPercent: 62, suitabilityScore: 80 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'sunny', conditionLabel: 'Hot & Clear', tempHighC: 36, tempHighF: 97, tempLowC: 28, tempLowF: 82, precipChancePercent: 5, humidityPercent: 55, windKmH: 12, summary: 'Strong solar radiation and high afternoon temperatures' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'sunny', conditionLabel: 'Clear Heat', tempHighC: 37, tempHighF: 99, tempLowC: 28, tempLowF: 82, precipChancePercent: 0, humidityPercent: 50, windKmH: 10, summary: 'High UV warning active around Connaught Place & Gurgaon' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'thunderstorm', conditionLabel: 'Dust Storm & Rain', tempHighC: 33, tempHighF: 91, tempLowC: 26, tempLowF: 79, precipChancePercent: 65, humidityPercent: 70, windKmH: 28, summary: 'Gusty winds and sudden evening thunder showers' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 32, tempHighF: 90, tempLowC: 26, tempLowF: 79, precipChancePercent: 20, humidityPercent: 65, summary: 'Cooler breeze following Tuesday storm' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'sunny', conditionLabel: 'Clear Sky', tempHighC: 35, tempHighF: 95, tempLowC: 27, tempLowF: 81, precipChancePercent: 0, humidityPercent: 52, summary: 'High solar energy yield expected' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'sunny', conditionLabel: 'Hot Sunny', tempHighC: 36, tempHighF: 97, tempLowC: 28, tempLowF: 82, precipChancePercent: 5, humidityPercent: 50, summary: 'Warm night temperatures' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'partly_cloudy', conditionLabel: 'Mild Clouds', tempHighC: 34, tempHighF: 93, tempLowC: 27, tempLowF: 81, precipChancePercent: 15, humidityPercent: 58, summary: 'Slight relief from peak heat' },
    ],
    tomorrow: {
      locationName: 'New Delhi, India',
      tempHighC: 37,
      tempLowC: 28,
      conditionLabel: 'Clear Heat Wave',
      condition: 'sunny',
      summary: 'High solar exposure with afternoon temperatures reaching 37°C. Hydration advisory in place.',
      outfitRecommendation: 'Light breathable cotton attire, sunglasses, and sun hat.',
      travelTip: 'Use AC transit options during peak afternoon hours between 12:00 PM and 04:00 PM IST.',
    },
    alerts: [
      {
        id: 'alt-del-1',
        type: 'Heat Warning',
        severity: 'severe',
        title: 'High Temperature & UV Advisory (Level 9)',
        description: 'Peak afternoon temperatures reaching 37°C (feels like 40°C) across NCR.',
        time: 'Today 12:00 PM - 04:00 PM IST',
        affectedArea: 'Delhi NCR, Gurgaon & Noida Expressway',
        recommendation: 'Drink water frequently. Minimize direct sun exposure during peak noon hours.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-del-1',
        category: 'solar',
        title: 'Photovoltaic Solar Generation',
        insight: 'Optimal generation forecast today (42.0 kWh yield under clear skies).',
        status: 'Optimal',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        detailText: 'Unobstructed solar irradiance from 09:00 AM to 04:00 PM IST.',
        metric: '42.0 kWh Output',
      },
    ],
    routes: [
      {
        origin: 'Connaught Place',
        destination: 'Gurgaon Cyber City',
        totalDistanceKm: 28,
        totalDurationMinutes: 40,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-d1', name: 'Connaught Place Outer Circle', distanceFromStartKm: 0, tempC: 34, tempF: 93, condition: 'sunny', conditionLabel: 'Hot Sunny', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-d2', name: 'Dhaula Kuan Junction', distanceFromStartKm: 12, tempC: 35, tempF: 95, condition: 'sunny', conditionLabel: 'Clear', hasAlert: true, alertText: 'High Heat Level 9', mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-d3', name: 'Cyber Hub Rapid Metro', distanceFromStartKm: 28, tempC: 36, tempF: 97, condition: 'sunny', conditionLabel: 'Hot Sunny', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },

  ccu: {
    location: CITIES[3],
    current: {
      tempC: 30,
      tempF: 86,
      feelsLikeC: 35,
      feelsLikeF: 95,
      condition: 'partly_cloudy',
      conditionLabel: 'Warm & High Humidity',
      visibilityKm: 9,
      humidityPercent: 82,
      uvIndex: 8,
      windKmH: 14,
      windDirection: 'S',
      pressureHpa: 1008,
      dewPointC: 25,
    },
    airQuality: {
      aqi: 58,
      label: 'Moderate',
      pm25: 18.2,
      pm10: 32.0,
      o3: 30.0,
      no2: 22.0,
      statusColor: '#eab308',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 27, tempF: 81, condition: 'sunny', precipChancePercent: 10, windKmH: 8, humidityPercent: 88, suitabilityScore: 88 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 29, tempF: 84, condition: 'sunny', precipChancePercent: 15, windKmH: 10, humidityPercent: 84, suitabilityScore: 82 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 32, tempF: 90, condition: 'partly_cloudy', precipChancePercent: 25, windKmH: 14, humidityPercent: 78, suitabilityScore: 72 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 31, tempF: 88, condition: 'rainy', precipChancePercent: 65, windKmH: 18, humidityPercent: 85, suitabilityScore: 60 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 28, tempF: 82, condition: 'partly_cloudy', precipChancePercent: 30, windKmH: 12, humidityPercent: 86, suitabilityScore: 80 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 27, tempF: 81, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 10, humidityPercent: 88, suitabilityScore: 76 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'partly_cloudy', conditionLabel: 'Warm & Humid', tempHighC: 32, tempHighF: 90, tempLowC: 26, tempLowF: 79, precipChancePercent: 30, humidityPercent: 82, windKmH: 14, summary: 'Moist Bay of Bengal air maintaining warm humid weather' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'rainy', conditionLabel: 'Kalbaishakhi Shower', tempHighC: 29, tempHighF: 84, tempLowC: 25, tempLowF: 77, precipChancePercent: 70, humidityPercent: 88, windKmH: 24, summary: 'Afternoon rain squalls across Hooghly river corridor' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'sunny', conditionLabel: 'Sunny Intervals', tempHighC: 31, tempHighF: 88, tempLowC: 26, tempLowF: 79, precipChancePercent: 15, humidityPercent: 78, windKmH: 12, summary: 'Clearing skies with bright sunshine' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Hot Sunshine', tempHighC: 33, tempHighF: 91, tempLowC: 27, tempLowF: 81, precipChancePercent: 10, humidityPercent: 75, summary: 'High heat index across Salt Lake & New Town' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 31, tempHighF: 88, tempLowC: 26, tempLowF: 79, precipChancePercent: 20, humidityPercent: 80, summary: 'Pleasant evening river breeze along Prinsep Ghat' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'rainy', conditionLabel: 'Light Showers', tempHighC: 29, tempHighF: 84, tempLowC: 25, tempLowF: 77, precipChancePercent: 55, humidityPercent: 85, summary: 'Passing showers keeping afternoon cool' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Clear Weekend', tempHighC: 31, tempHighF: 88, tempLowC: 26, tempLowF: 79, precipChancePercent: 10, humidityPercent: 76, summary: 'Great weekend for shopping along Park Street' },
    ],
    tomorrow: {
      locationName: 'Kolkata, India',
      tempHighC: 29,
      tempLowC: 25,
      conditionLabel: 'Afternoon Thundershowers',
      condition: 'rainy',
      summary: 'High humidity through the morning triggering scattered thundershowers after 02:30 PM IST.',
      outfitRecommendation: 'Light breathable clothes with waterproof umbrella.',
      travelTip: 'Traffic near Howrah Bridge & Park Circus flyover may move slowly during rain spells.',
    },
    alerts: [
      {
        id: 'alt-ccu-1',
        type: 'Rain Advisory',
        severity: 'moderate',
        title: 'Afternoon Shower Warning',
        description: 'Bay of Bengal cloud cluster bringing rain between 02:30 PM and 06:30 PM IST.',
        time: 'Today 02:30 PM - 06:30 PM IST',
        affectedArea: 'Kolkata Metro, Salt Lake Sector V & EM Bypass',
        recommendation: 'Keep umbrella handy. Drive cautiously on wet roads.',
        iconName: 'CloudRain',
      },
    ],
    recommendations: [
      {
        id: 'rec-ccu-1',
        category: 'outdoor',
        title: 'Maidan Morning Walk Window',
        insight: 'Best time 06:00 AM – 08:30 AM IST before humidity and heat build up.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Pleasant morning temperature of 27°C with gentle southerly breeze.',
        metric: '92% Suitability',
      },
    ],
    routes: [
      {
        origin: 'Park Street',
        destination: 'Salt Lake Sector V',
        totalDistanceKm: 14,
        totalDurationMinutes: 28,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-c1', name: 'Park Street Metro', distanceFromStartKm: 0, tempC: 30, tempF: 86, condition: 'partly_cloudy', conditionLabel: 'Humid', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-c2', name: 'EM Bypass Junction', distanceFromStartKm: 7, tempC: 31, tempF: 88, condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', hasAlert: false, mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-c3', name: 'Sector V IT Hub', distanceFromStartKm: 14, tempC: 31, tempF: 88, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },

  maa: {
    location: CITIES[4],
    current: {
      tempC: 32,
      tempF: 90,
      feelsLikeC: 36,
      feelsLikeF: 97,
      condition: 'sunny',
      conditionLabel: 'Hot Coastal Sun',
      visibilityKm: 10,
      humidityPercent: 75,
      uvIndex: 9,
      windKmH: 18,
      windDirection: 'SE',
      pressureHpa: 1009,
      dewPointC: 24,
    },
    airQuality: {
      aqi: 36,
      label: 'Good',
      pm25: 8.5,
      pm10: 15.2,
      o3: 25.0,
      no2: 12.0,
      statusColor: '#22c55e',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 27, tempF: 81, condition: 'sunny', precipChancePercent: 0, windKmH: 10, humidityPercent: 80, suitabilityScore: 92 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 30, tempF: 86, condition: 'sunny', precipChancePercent: 5, windKmH: 14, humidityPercent: 76, suitabilityScore: 82 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 33, tempF: 91, condition: 'sunny', precipChancePercent: 5, windKmH: 18, humidityPercent: 72, suitabilityScore: 68 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 32, tempF: 90, condition: 'sunny', precipChancePercent: 10, windKmH: 20, humidityPercent: 74, suitabilityScore: 75 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 29, tempF: 84, condition: 'partly_cloudy', precipChancePercent: 10, windKmH: 16, humidityPercent: 78, suitabilityScore: 88 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 28, tempF: 82, condition: 'sunny', precipChancePercent: 0, windKmH: 12, humidityPercent: 82, suitabilityScore: 80 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'sunny', conditionLabel: 'Hot Coastal Sun', tempHighC: 33, tempHighF: 91, tempLowC: 27, tempLowF: 81, precipChancePercent: 5, humidityPercent: 75, windKmH: 18, summary: 'Strong coastal sun with pleasant afternoon sea breeze along Marina Beach' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'sunny', conditionLabel: 'Clear Skies', tempHighC: 34, tempHighF: 93, tempLowC: 27, tempLowF: 81, precipChancePercent: 0, humidityPercent: 72, windKmH: 16, summary: 'High solar yield expected along OMR IT Corridor' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 32, tempHighF: 90, tempLowC: 26, tempLowF: 79, precipChancePercent: 20, humidityPercent: 76, windKmH: 15, summary: 'Mild cloud cover offering relief from peak radiation' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Hot Sunny', tempHighC: 35, tempHighF: 95, tempLowC: 28, tempLowF: 82, precipChancePercent: 0, humidityPercent: 70, summary: 'High UV index warning active around noon' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'rainy', conditionLabel: 'Evening Drizzle', tempHighC: 31, tempHighF: 88, tempLowC: 26, tempLowF: 79, precipChancePercent: 50, humidityPercent: 82, summary: 'Passing evening showers across Guindy & Adyar' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'sunny', conditionLabel: 'Clear Sunshine', tempHighC: 33, tempHighF: 91, tempLowC: 27, tempLowF: 81, precipChancePercent: 10, humidityPercent: 74, summary: 'Clear conditions across the city' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Bright Weekend', tempHighC: 34, tempHighF: 93, tempLowC: 27, tempLowF: 81, precipChancePercent: 5, humidityPercent: 73, summary: 'Ideal for coastal road trips along ECR' },
    ],
    tomorrow: {
      locationName: 'Chennai, India',
      tempHighC: 34,
      tempLowC: 27,
      conditionLabel: 'Clear Coastal Sun',
      condition: 'sunny',
      summary: 'Bright sunshine with refreshing afternoon sea breeze along the Coromandel coast.',
      outfitRecommendation: 'Light cotton clothing, UV protective sunglasses, and sunscreen.',
      travelTip: 'ECR (East Coast Road) traffic remains smooth with clear visibility.',
    },
    alerts: [
      {
        id: 'alt-maa-1',
        type: 'UV Advisory',
        severity: 'info',
        title: 'High UV Radiation (Level 9)',
        description: 'Peak solar UV rays between 11:30 AM and 03:00 PM IST.',
        time: 'Today 11:30 AM - 03:00 PM IST',
        affectedArea: 'Chennai Coast & OMR',
        recommendation: 'Use SPF 50+ sunscreen when outdoors.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-maa-1',
        category: 'outdoor',
        title: 'Besant Nagar Promenade Walk',
        insight: 'Best window 05:30 PM – 07:30 PM IST with cool sea breeze.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Refreshing ocean breeze makes sunset hours ideal for walking.',
        metric: '95% Suitability',
      },
    ],
    routes: [
      {
        origin: 'Mount Road (Anna Salai)',
        destination: 'Mahabalipuram via ECR',
        totalDistanceKm: 52,
        totalDurationMinutes: 65,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-ch1', name: 'Anna Flyover', distanceFromStartKm: 0, tempC: 32, tempF: 90, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-ch2', name: 'Sholinganallur Junction', distanceFromStartKm: 22, tempC: 33, tempF: 91, condition: 'sunny', conditionLabel: 'Clear', hasAlert: false, mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-ch3', name: 'Mahabalipuram Shore Temple', distanceFromStartKm: 52, tempC: 32, tempF: 90, condition: 'sunny', conditionLabel: 'Sea Breeze', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },

  hyd: {
    location: CITIES[5],
    current: {
      tempC: 29,
      tempF: 84,
      feelsLikeC: 31,
      feelsLikeF: 88,
      condition: 'partly_cloudy',
      conditionLabel: 'Pleasant & Warm',
      visibilityKm: 10,
      humidityPercent: 65,
      uvIndex: 7,
      windKmH: 15,
      windDirection: 'W',
      pressureHpa: 1012,
      dewPointC: 20,
    },
    airQuality: {
      aqi: 45,
      label: 'Good',
      pm25: 10.1,
      pm10: 20.4,
      o3: 26.0,
      no2: 16.0,
      statusColor: '#22c55e',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 23, tempF: 73, condition: 'sunny', precipChancePercent: 0, windKmH: 10, humidityPercent: 75, suitabilityScore: 95 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 26, tempF: 79, condition: 'sunny', precipChancePercent: 5, windKmH: 12, humidityPercent: 68, suitabilityScore: 92 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 29, tempF: 84, condition: 'partly_cloudy', precipChancePercent: 10, windKmH: 15, humidityPercent: 62, suitabilityScore: 85 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 30, tempF: 86, condition: 'partly_cloudy', precipChancePercent: 15, windKmH: 16, humidityPercent: 60, suitabilityScore: 80 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 27, tempF: 81, condition: 'sunny', precipChancePercent: 5, windKmH: 13, humidityPercent: 68, suitabilityScore: 90 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 25, tempF: 77, condition: 'partly_cloudy', precipChancePercent: 0, windKmH: 10, humidityPercent: 72, suitabilityScore: 84 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'partly_cloudy', conditionLabel: 'Pleasant & Warm', tempHighC: 30, tempHighF: 86, tempLowC: 23, tempLowF: 73, precipChancePercent: 10, humidityPercent: 65, windKmH: 15, summary: 'Pleasant breeze around Hussain Sagar Lake & Jubilee Hills' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'sunny', conditionLabel: 'Clear Sky', tempHighC: 31, tempHighF: 88, tempLowC: 23, tempLowF: 73, precipChancePercent: 5, humidityPercent: 60, windKmH: 13, summary: 'Ideal weather for outdoor activities and travel' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'rainy', conditionLabel: 'Passing Showers', tempHighC: 28, tempHighF: 82, tempLowC: 22, tempLowF: 72, precipChancePercent: 55, humidityPercent: 78, windKmH: 20, summary: 'Light rain expected across HITEC City corridor' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Bright & Warm', tempHighC: 30, tempHighF: 86, tempLowC: 23, tempLowF: 73, precipChancePercent: 10, humidityPercent: 64, summary: 'Good air quality and clear sunshine' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'partly_cloudy', conditionLabel: 'Partly Cloudy', tempHighC: 29, tempHighF: 84, tempLowC: 22, tempLowF: 72, precipChancePercent: 15, humidityPercent: 66, summary: 'Cool evening breeze across Gachibowli' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'sunny', conditionLabel: 'Sunny Skies', tempHighC: 31, tempHighF: 88, tempLowC: 23, tempLowF: 73, precipChancePercent: 5, humidityPercent: 62, summary: 'Great for weekend travel' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Clear Weekend', tempHighC: 32, tempHighF: 90, tempLowC: 24, tempLowF: 75, precipChancePercent: 0, humidityPercent: 58, summary: 'Warm clear weekend weather' },
    ],
    tomorrow: {
      locationName: 'Hyderabad, India',
      tempHighC: 31,
      tempLowC: 23,
      conditionLabel: 'Clear Sky',
      condition: 'sunny',
      summary: 'Pleasant morning hours around 23°C warming to 31°C with clear skies and moderate breeze.',
      outfitRecommendation: 'Light breathable cotton outfit with sunglasses.',
      travelTip: 'Outer Ring Road (ORR) driving conditions are optimal with clear visibility.',
    },
    alerts: [
      {
        id: 'alt-hyd-1',
        type: 'Optimal Weather Alert',
        severity: 'info',
        title: 'Favorable Atmospheric Index',
        description: 'Moderate humidity (65%) and pleasant wind speeds across Telangana plateau.',
        time: 'Today All Day IST',
        affectedArea: 'Greater Hyderabad Area',
        recommendation: 'Great conditions for sports, commuting, and solar yield.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-hyd-1',
        category: 'running',
        title: 'KBR Park Trail Run',
        insight: 'Best window 06:00 AM – 08:30 AM IST. Cool 23°C temperature.',
        status: 'Optimal',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        detailText: 'Fresh air quality and shaded trails offer optimal athletic conditions.',
        metric: '96% Suitability',
      },
    ],
    routes: [
      {
        origin: 'Banjara Hills',
        destination: 'HITEC City (Cyberabad)',
        totalDistanceKm: 12,
        totalDurationMinutes: 22,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-h1', name: 'Jubilee Hills Checkpost', distanceFromStartKm: 0, tempC: 29, tempF: 84, condition: 'partly_cloudy', conditionLabel: 'Pleasant', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-h2', name: 'Durgam Cheruvu Cable Bridge', distanceFromStartKm: 7, tempC: 29, tempF: 84, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-h3', name: 'Mindspace Cyberabad', distanceFromStartKm: 12, tempC: 30, tempF: 86, condition: 'sunny', conditionLabel: 'Clear', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },

  jpr: {
    location: CITIES[6],
    current: {
      tempC: 35,
      tempF: 95,
      feelsLikeC: 37,
      feelsLikeF: 98,
      condition: 'sunny',
      conditionLabel: 'Sunny Desert Breeze',
      visibilityKm: 10,
      humidityPercent: 42,
      uvIndex: 9,
      windKmH: 14,
      windDirection: 'NW',
      pressureHpa: 1006,
      dewPointC: 18,
    },
    airQuality: {
      aqi: 52,
      label: 'Moderate',
      pm25: 16.5,
      pm10: 34.0,
      o3: 32.0,
      no2: 18.0,
      statusColor: '#eab308',
    },
    hourly: [
      { time: '06:00 AM', label: '06:00 AM', period: 'Morning', tempC: 28, tempF: 82, condition: 'sunny', precipChancePercent: 0, windKmH: 8, humidityPercent: 55, suitabilityScore: 90 },
      { time: '09:00 AM', label: '09:00 AM', period: 'Morning', tempC: 31, tempF: 88, condition: 'sunny', precipChancePercent: 0, windKmH: 10, humidityPercent: 50, suitabilityScore: 84 },
      { time: '12:00 PM', label: '12:00 PM', period: 'Afternoon', tempC: 35, tempF: 95, condition: 'sunny', precipChancePercent: 0, windKmH: 14, humidityPercent: 42, suitabilityScore: 70 },
      { time: '03:00 PM', label: '03:00 PM', period: 'Afternoon', tempC: 36, tempF: 97, condition: 'sunny', precipChancePercent: 5, windKmH: 16, humidityPercent: 38, suitabilityScore: 65 },
      { time: '06:00 PM', label: '06:00 PM', period: 'Evening', tempC: 32, tempF: 90, condition: 'sunny', precipChancePercent: 0, windKmH: 12, humidityPercent: 46, suitabilityScore: 88 },
      { time: '09:00 PM', label: '09:00 PM', period: 'Night', tempC: 29, tempF: 84, condition: 'sunny', precipChancePercent: 0, windKmH: 9, humidityPercent: 52, suitabilityScore: 82 },
    ],
    daily: [
      { day: 'Sun', fullDayName: 'Sunday', date: '26/07/2026', condition: 'sunny', conditionLabel: 'Sunny Desert Breeze', tempHighC: 36, tempHighF: 97, tempLowC: 27, tempLowF: 81, precipChancePercent: 0, humidityPercent: 42, windKmH: 14, summary: 'Warm dry sunshine over Amer Fort and Hawa Mahal' },
      { day: 'Mon', fullDayName: 'Monday', date: '27/07/2026', condition: 'sunny', conditionLabel: 'Clear Blue', tempHighC: 37, tempHighF: 99, tempLowC: 28, tempLowF: 82, precipChancePercent: 0, humidityPercent: 40, windKmH: 12, summary: 'Bright sunny day with moderate UV radiation' },
      { day: 'Tue', fullDayName: 'Tuesday', date: '28/07/2026', condition: 'partly_cloudy', conditionLabel: 'Passing Clouds', tempHighC: 34, tempHighF: 93, tempLowC: 26, tempLowF: 79, precipChancePercent: 15, humidityPercent: 50, windKmH: 16, summary: 'Mild cloud cover reducing peak heat' },
      { day: 'Wed', fullDayName: 'Wednesday', date: '29/07/2026', condition: 'sunny', conditionLabel: 'Hot Sunshine', tempHighC: 36, tempHighF: 97, tempLowC: 27, tempLowF: 81, precipChancePercent: 0, humidityPercent: 42, summary: 'Great conditions for rooftop solar generation' },
      { day: 'Thu', fullDayName: 'Thursday', date: '30/07/2026', condition: 'sunny', conditionLabel: 'Clear Sky', tempHighC: 35, tempHighF: 95, tempLowC: 26, tempLowF: 79, precipChancePercent: 5, humidityPercent: 45, summary: 'Pleasant evening temperature around Jal Mahal' },
      { day: 'Fri', fullDayName: 'Friday', date: '31/07/2026', condition: 'sunny', conditionLabel: 'Clear Sunshine', tempHighC: 36, tempHighF: 97, tempLowC: 27, tempLowF: 81, precipChancePercent: 0, humidityPercent: 43, summary: 'Clear sunny sky with light breeze' },
      { day: 'Sat', fullDayName: 'Saturday', date: '01/08/2026', condition: 'sunny', conditionLabel: 'Bright Weekend', tempHighC: 35, tempHighF: 95, tempLowC: 26, tempLowF: 79, precipChancePercent: 0, humidityPercent: 44, summary: 'Ideal weekend for heritage tours' },
    ],
    tomorrow: {
      locationName: 'Jaipur, India',
      tempHighC: 37,
      tempLowC: 28,
      conditionLabel: 'Clear Desert Sunshine',
      condition: 'sunny',
      summary: 'Dry sunny weather with temperatures reaching 37°C. Clear skies throughout.',
      outfitRecommendation: 'Light breathable linen clothes, sunglasses, and sun visor.',
      travelTip: 'Jaipur-Delhi NH48 highway remains clear with excellent driving visibility.',
    },
    alerts: [
      {
        id: 'alt-jpr-1',
        type: 'UV Warning',
        severity: 'info',
        title: 'High Solar Irradiance (Level 9)',
        description: 'Peak UV index between 11:30 AM and 03:00 PM IST.',
        time: 'Today 11:30 AM - 03:00 PM IST',
        affectedArea: 'Pink City, Jaipur & Amer Corridor',
        recommendation: 'Wear sun protection when touring outdoor monuments.',
        iconName: 'Sun',
      },
    ],
    recommendations: [
      {
        id: 'rec-jpr-1',
        category: 'solar',
        title: 'Rooftop Solar Harvest',
        insight: 'High solar output (40.5 kWh) under clear dry skies.',
        status: 'Optimal',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        detailText: 'Low moisture and unclouded sky maximize solar cell efficiency.',
        metric: '40.5 kWh Output',
      },
    ],
    routes: [
      {
        origin: 'Jaipur Pink City',
        destination: 'Delhi NCR via NH48',
        totalDistanceKm: 270,
        totalDurationMinutes: 240,
        overallHazardLevel: 'Low',
        waypoints: [
          { id: 'wp-j1', name: 'Amer Fort Road', distanceFromStartKm: 0, tempC: 35, tempF: 95, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 20, mapYPercent: 30 },
          { id: 'wp-j2', name: 'Shahpura Plaza (NH48)', distanceFromStartKm: 70, tempC: 36, tempF: 97, condition: 'sunny', conditionLabel: 'Clear Sky', hasAlert: false, mapXPercent: 50, mapYPercent: 50 },
          { id: 'wp-j3', name: 'Gurgaon Toll Plaza', distanceFromStartKm: 270, tempC: 34, tempF: 93, condition: 'sunny', conditionLabel: 'Sunny', hasAlert: false, mapXPercent: 80, mapYPercent: 70 },
        ],
      },
    ],
  },
};

export function findPerfectWindow(
  activity: ActivityType, 
  hourlyData: HourlyPoint[],
  durationHours: number = 2
): TimeWindowResult {
  if (!hourlyData || hourlyData.length === 0) {
    return {
      activity,
      durationHours,
      bestStartTime: '06:00 AM',
      bestEndTime: '08:00 AM',
      score: 85,
      reason: 'Standard morning slot (Default fallback)',
      hourlyScores: [],
    };
  }

  let bestScore = -1;
  let bestStartIndex = 0;

  const activityWeights: Record<ActivityType, { idealTemp: number; maxRain: number; maxWind: number }> = {
    'Cricket': { idealTemp: 26, maxRain: 10, maxWind: 20 },
    'Running': { idealTemp: 22, maxRain: 15, maxWind: 25 },
    'Cycling': { idealTemp: 24, maxRain: 10, maxWind: 18 },
    'Outdoor Photography': { idealTemp: 25, maxRain: 5, maxWind: 20 },
    'Drone Flying': { idealTemp: 25, maxRain: 0, maxWind: 15 },
    'Solar Generation': { idealTemp: 28, maxRain: 10, maxWind: 30 },
    'Tennis': { idealTemp: 25, maxRain: 5, maxWind: 18 },
    'Lawn Mowing': { idealTemp: 25, maxRain: 10, maxWind: 25 },
    'Beach Visit': { idealTemp: 29, maxRain: 5, maxWind: 20 },
  };

  const weights = activityWeights[activity] || { idealTemp: 25, maxRain: 15, maxWind: 20 };

  const hourlyScores = hourlyData.map((h) => {
    const tempDiff = Math.abs(h.tempC - weights.idealTemp);
    const tempScore = Math.max(0, 100 - tempDiff * 4);
    const rainScore = Math.max(0, 100 - h.precipChancePercent * 1.5);
    const windPenalty = h.windKmH > weights.maxWind ? (h.windKmH - weights.maxWind) * 5 : 0;
    const windScore = Math.max(0, 100 - windPenalty);

    const totalScore = Math.round(tempScore * 0.4 + rainScore * 0.4 + windScore * 0.2);

    return {
      time: h.label,
      tempC: h.tempC,
      rainChance: h.precipChancePercent,
      humidity: h.humidityPercent,
      score: totalScore,
    };
  });

  const k = Math.min(durationHours, hourlyData.length);
  for (let i = 0; i <= hourlyData.length - k; i++) {
    let windowSum = 0;
    for (let j = 0; j < k; j++) {
      windowSum += hourlyScores[i + j].score;
    }
    const avgScore = windowSum / k;
    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestStartIndex = i;
    }
  }

  const startHour = hourlyData[bestStartIndex];
  const endHour = hourlyData[Math.min(bestStartIndex + k - 1, hourlyData.length - 1)];

  return {
    activity,
    durationHours,
    bestStartTime: startHour ? startHour.label : '06:00 AM',
    bestEndTime: endHour ? endHour.label : '08:00 AM',
    score: Math.round(bestScore > 0 ? bestScore : 92),
    reason: `Low rain chance (${startHour?.precipChancePercent || 0}%), comfortable ${startHour?.tempC || 26}°C, mild breeze (${startHour?.windKmH || 12} km/h)`,
    hourlyScores,
  };
}

export function calculateRouteWeather(origin: string, destination: string): { hazardLevel: 'Low' | 'Moderate' | 'High'; distance: number; duration: number } {
  return {
    hazardLevel: 'Low',
    distance: 28,
    duration: 42,
  };
}
