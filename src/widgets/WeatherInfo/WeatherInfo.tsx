import { HourlyForecast } from '../HourlyForecast';
import type {
  WeatherData,
  ForecastData,
  ForecastItem,
} from '../../shared/types/weather';

interface WeatherInfoProps {
  weatherData: WeatherData;
  forecastData?: ForecastData;
  title: string;
  subTitle?: string;
  isLoading?: boolean;
}

export function WeatherInfo({
  weatherData,
  forecastData,
  title,
  subTitle,
  isLoading,
}: WeatherInfoProps) {
  // Calculate today's high/low from forecast data
  const getTodayHighLow = () => {
    if (!forecastData) {
      return {
        high: weatherData.main.temp_max,
        low: weatherData.main.temp_min,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayForecasts = forecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate >= today && itemDate < tomorrow;
    });

    if (todayForecasts.length === 0) {
      return {
        high: weatherData.main.temp_max,
        low: weatherData.main.temp_min,
      };
    }

    const temps = todayForecasts.map((item: ForecastItem) => item.main.temp);
    return {
      high: Math.max(...temps, weatherData.main.temp),
      low: Math.min(...temps, weatherData.main.temp),
    };
  };

  const { high, low } = getTodayHighLow();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 lg:mb-14 py-6 sm:py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold m-0 mb-2 text-white drop-shadow-md">
          {title}
        </h1>
        {subTitle && (
          <p className="text-base sm:text-lg md:text-xl m-0 mb-4 sm:mb-5 md:mb-6 text-white/70">
            {subTitle}
          </p>
        )}
        <div className="text-7xl sm:text-8xl md:text-9xl font-extralight my-5 sm:my-6 md:my-8 text-white leading-none drop-shadow-lg">
          {Math.round(weatherData.main.temp)}°
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl my-3 sm:my-4 md:my-5 text-white/90 capitalize">
          {weatherData.weather[0]?.description || '정보 없음'}
        </p>
        <p className="text-base sm:text-lg md:text-xl text-white/70 my-2">
          최고:{Math.round(high)}° 최저:{Math.round(low)}°
        </p>
      </div>

      {/* Hourly Forecast */}
      {forecastData && !isLoading && (
        <HourlyForecast
          forecasts={forecastData.list}
          currentWeather={weatherData}
        />
      )}

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-10 md:mt-12">
        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">
            체감온도
          </div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {Math.round(weatherData.main.feels_like)}°
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">습도</div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {weatherData.main.humidity}%
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">풍속</div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {weatherData.wind.speed}m/s
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">기압</div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {weatherData.main.pressure}hPa
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">
            가시거리
          </div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {(weatherData.visibility / 1000).toFixed(1)}km
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors duration-200">
          <div className="text-sm sm:text-base text-white/60 mb-2">구름</div>
          <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
            {weatherData.clouds.all}%
          </div>
        </div>
      </div>
    </div>
  );
}
