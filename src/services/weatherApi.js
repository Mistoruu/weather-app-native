const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Formatage des données pour les écrans
const formatWeatherData = (data) => ({
  cityName: data.name,
  country: data.sys?.country || '',
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  tempMin: Math.round(data.main.temp_min),
  tempMax: Math.round(data.main.temp_max),
  condition: data.weather[0]?.description || '',
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  windSpeed: data.wind?.speed || 0,
  visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
  cloudiness: data.clouds?.all || 0,
  sunrise: new Date(data.sys?.sunrise * 1000),
  sunset: new Date(data.sys?.sunset * 1000),
  updatedAt: new Date(data.dt * 1000),
  coords: { lat: data.coord?.lat, lon: data.coord?.lon },
});

export const getWeatherByCity = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`);
    if (!response.ok) throw new Error("Ville introuvable.");
    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    throw error;
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`);
    if (!response.ok) throw new Error("Problème avec la géolocalisation.");
    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    throw error;
  }
};