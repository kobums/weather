import { useEffect } from 'react';
import { useWeatherByCity, useForecastByCity } from '../../entities/weather';
import { WeatherInfo } from '../WeatherInfo';

interface WeatherDetailSectionProps {
  cityName: string;
  locationName: string;
  originalLocationName?: string;
  onUpdateTheme?: (isNight: boolean) => void;
}

export function WeatherDetailSection({
  cityName,
  locationName,
  originalLocationName,
  onUpdateTheme,
}: WeatherDetailSectionProps) {
  const { data: weatherData, isLoading, error } = useWeatherByCity(cityName);
  const { data: forecastData, isLoading: forecastLoading } =
    useForecastByCity(cityName);

  useEffect(() => {
    if (weatherData && onUpdateTheme) {
      const isNight =
        weatherData.dt < weatherData.sys.sunrise ||
        weatherData.dt > weatherData.sys.sunset;
      onUpdateTheme(isNight);
    }
  }, [weatherData, onUpdateTheme]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center">
          <div className="text-base sm:text-lg animate-pulse">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center">
          <div className="text-base sm:text-lg">
            해당 장소의 정보가 제공되지 않습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <WeatherInfo
      weatherData={weatherData}
      forecastData={forecastData}
      title={locationName}
      subTitle={originalLocationName}
      isLoading={forecastLoading}
    />
  );
}
