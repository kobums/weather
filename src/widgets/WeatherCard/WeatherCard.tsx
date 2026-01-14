import type { WeatherCardProps } from '../../shared/types/weather';

export function WeatherCard({
  locationName,
  currentTemp,
  maxTemp,
  minTemp,
  weatherDescription,
  subtitle = '내일 화제',
}: WeatherCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#2c3e50] to-[#34495e] rounded-[20px] p-6 w-80 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold m-0 mb-1 text-white">
            {locationName}
          </h2>
          <p className="text-sm m-0 text-white/60">{subtitle}</p>
        </div>
        <div className="text-[56px] font-light text-white leading-none">
          {Math.round(currentTemp)}°
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-white/90">{weatherDescription}</span>
        <span className="text-white/70">
          최고:{Math.round(maxTemp)}° 최저:{Math.round(minTemp)}°
        </span>
      </div>
    </div>
  );
}
