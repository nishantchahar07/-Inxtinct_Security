import axios from 'axios';
import { toSingleSentence } from '../utils/format';

export async function runWeatherTool(city: string): Promise<string> {
  try {
    const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: city, count: 1, language: 'en', format: 'json' },
      timeout: 8000,
    });
    const place = geo.data?.results?.[0];
    if (!place) {
      return toSingleSentence(`I could not find weather information for ${city}.`);
    }
    const { latitude, longitude, name } = place;
    const weather = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude, longitude, current_weather: true },
      timeout: 8000,
    });
    const cw = weather.data?.current_weather;
    if (!cw) {
      return toSingleSentence(`I could not retrieve the weather for ${name}.`);
    }
    const temp = typeof cw.temperature === 'number' ? Math.round(cw.temperature) : cw.temperature;
    const description = mapWeatherCodeToText(cw.weathercode);
    return toSingleSentence(`The weather in ${name} is ${temp}°C with ${description}.`);
  } catch {
    return toSingleSentence('I could not retrieve the weather at the moment.');
  }
}

function mapWeatherCodeToText(code: number): string {
  const mapping: Record<number, string> = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    61: 'slight rain',
    63: 'rain',
    65: 'heavy rain',
    71: 'slight snow fall',
    73: 'snow fall',
    75: 'heavy snow fall',
    80: 'rain showers',
    81: 'heavy rain showers',
    82: 'violent rain showers',
    95: 'thunderstorm',
    99: 'thunderstorm with hail',
  };
  return mapping[code] ?? 'typical conditions';
}
