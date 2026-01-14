import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '../../../shared/api/weatherApi';

export function useWeatherByCity(cityName: string) {
  return useQuery({
    queryKey: ['weather', cityName],
    queryFn: () => weatherApi.getWeatherByCity(cityName),
    enabled: !!cityName,
  });
}

export function useWeatherByCoords(lat: number, lon: number) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => weatherApi.getWeatherByCoords(lat, lon),
    enabled: lat !== 0 && lon !== 0,
  });
}

export function useForecastByCity(cityName: string) {
  return useQuery({
    queryKey: ['forecast', cityName],
    queryFn: () => weatherApi.getForecastByCity(cityName),
    enabled: !!cityName,
  });
}

export function useForecastByCoords(lat: number, lon: number) {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => weatherApi.getForecastByCoords(lat, lon),
    enabled: lat !== 0 && lon !== 0,
  });
}
