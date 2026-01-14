import { useEffect } from 'react';
import {
  useWeatherByCoords,
  useForecastByCoords,
} from '../../entities/weather';
import { WeatherInfo } from '../WeatherInfo';

interface CurrentLocationWeatherProps {
  latitude: number;
  longitude: number;
  onUpdateTheme?: (isNight: boolean) => void;
}

export function CurrentLocationWeather({
  latitude,
  longitude,
  onUpdateTheme,
}: CurrentLocationWeatherProps) {
  const {
    data: weatherData,
    isLoading,
    error,
  } = useWeatherByCoords(latitude, longitude);
  const { data: forecastData, isLoading: forecastLoading } =
    useForecastByCoords(latitude, longitude);

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
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center">
          <div className="text-base sm:text-lg">
            현재 위치의 날씨를 가져오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center">
          <p className="my-2 text-base sm:text-lg">
            현재 위치의 날씨 정보를 가져올 수 없습니다.
          </p>
          <p className="my-2 text-base sm:text-lg">
            좌측에서 위치를 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <WeatherInfo
      weatherData={weatherData}
      forecastData={forecastData}
      title="현재 위치"
      isLoading={forecastLoading}
    />
  );
}
