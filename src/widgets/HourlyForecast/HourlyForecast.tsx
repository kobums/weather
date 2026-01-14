import type { ForecastItem, WeatherData } from '../../shared/types/weather';

interface HourlyForecastProps {
  forecasts: ForecastItem[];
  currentWeather: WeatherData;
}

export function HourlyForecast({
  forecasts,
  currentWeather,
}: HourlyForecastProps) {
  // Interpolate data to create hourly data starting from now
  const interpolateHourlyData = () => {
    // Use currentWeather.dt as the anchor for "Now" to resolve impure function lint error
    const now = currentWeather.dt;

    // 1. Create reference points array
    const points = [
      {
        dt: now,
        temp: currentWeather.main.temp,
        icon: currentWeather.weather[0]?.icon || '',
      },
      ...forecasts.map((f) => ({
        dt: f.dt,
        temp: f.main.temp,
        icon: f.weather[0]?.icon || '',
      })),
    ].sort((a, b) => a.dt - b.dt);

    // 2. Generate target hours
    const result: Array<{ dt: number; temp: number; icon: string }> = [];

    // First item is always "Now" (from currentWeather)
    result.push(points.find((p) => p.dt === now) || points[0]);

    // Next 23 hours aligned to clock
    const currentDate = new Date(now * 1000);
    currentDate.setMinutes(0, 0, 0);
    currentDate.setHours(currentDate.getHours() + 1); // Next exact hour

    let targetTimeMs = currentDate.getTime();

    for (let i = 0; i < 24; i++) {
      const targetDt = Math.floor(targetTimeMs / 1000);

      // Find prev and next points
      let p1 = points[0];
      let p2 = points[points.length - 1];

      for (let j = 0; j < points.length - 1; j++) {
        if (points[j].dt <= targetDt && points[j + 1].dt >= targetDt) {
          p1 = points[j];
          p2 = points[j + 1];
          break;
        }
      }

      // Interpolate
      const totalSpan = p2.dt - p1.dt;
      const currentSpan = targetDt - p1.dt;
      const ratio = totalSpan === 0 ? 0 : currentSpan / totalSpan;

      const interpolatedTemp = p1.temp + (p2.temp - p1.temp) * ratio;

      result.push({
        dt: targetDt,
        temp: interpolatedTemp,
        icon: ratio < 0.5 ? p1.icon : p2.icon,
      });

      targetTimeMs += 3600 * 1000; // +1 hour
    }

    // Inject Sunrise/Sunset
    const sunEvents = [
      {
        dt: currentWeather.sys.sunrise,
        type: 'sunrise' as const,
        label: '일출',
      },
      { dt: currentWeather.sys.sunset, type: 'sunset' as const, label: '일몰' },
      {
        dt: currentWeather.sys.sunrise + 86400,
        type: 'sunrise' as const,
        label: '일출',
      },
      {
        dt: currentWeather.sys.sunset + 86400,
        type: 'sunset' as const,
        label: '일몰',
      },
    ];

    // Sort sun events
    sunEvents.sort((a, b) => a.dt - b.dt);

    const finalResult: Array<{
      dt: number;
      temp: number;
      icon: string;
      type: 'weather' | 'sunrise' | 'sunset';
      label?: string;
    }> = [];

    // Add first weather item
    if (result.length > 0) {
      finalResult.push({ ...result[0], type: 'weather' });
    }

    for (let i = 0; i < result.length - 1; i++) {
      const currentItem = result[i];
      const nextItem = result[i + 1];

      // Check if any sun event is between current and next
      const eventsInBetween = sunEvents.filter(
        (e) => e.dt > currentItem.dt && e.dt <= nextItem.dt
      );

      eventsInBetween.forEach((e) => {
        finalResult.push({
          dt: e.dt,
          temp: 0,
          icon: '',
          type: e.type,
          label: e.label,
        });
      });

      finalResult.push({ ...nextItem, type: 'weather' });
    }

    return finalResult;
  };

  const hourlyData = interpolateHourlyData();

  const formatTime = (dt: number, withMinutes = false) => {
    const date = new Date(dt * 1000);
    const hour = date.getHours();
    const minute = date.getMinutes();

    const minuteStr = withMinutes
      ? `:${minute.toString().padStart(2, '0')}`
      : '';

    if (hour === 0) {
      return `오전 12${minuteStr}${withMinutes ? '' : '시'}`;
    } else if (hour < 12) {
      return `오전 ${hour}${minuteStr}${withMinutes ? '' : '시'}`;
    } else if (hour === 12) {
      return `오후 12${minuteStr}${withMinutes ? '' : '시'}`;
    } else {
      return `오후 ${hour - 12}${minuteStr}${withMinutes ? '' : '시'}`;
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
    return (
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="날씨 아이콘"
        className="w-10 h-10 sm:w-12 sm:h-12"
      />
    );
  };

  return (
    <div className="my-8 sm:my-10 md:my-12 bg-black/20 rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md border border-white/20">
      <div className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto overflow-y-hidden py-2 scroll-smooth [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:mx-1 [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/40">
        {hourlyData.map((item, index) => (
          <div
            key={`${item.dt}-${item.type}`}
            className="flex flex-col items-center gap-2 sm:gap-3 min-w-[70px] sm:min-w-[80px] flex-shrink-0 text-center hover:bg-white/10 rounded-xl p-2 transition-colors duration-200"
          >
            <div className="text-sm sm:text-base text-white/90 font-medium whitespace-nowrap">
              {item.type === 'weather'
                ? index === 0
                  ? '지금'
                  : formatTime(item.dt)
                : formatTime(item.dt, true)}
            </div>
            <div className="flex items-center justify-center">
              {item.type === 'weather' ? (
                getWeatherIcon(item.icon)
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                  {item.type === 'sunrise' ? (
                    <svg
                      className="w-8 h-8 text-yellow-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v5m0-18h0m0 0a9 9 0 110 18 9 9 0 010-18zm0 0v9m-4-6l4-4 4 4"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        className="hidden"
                      />
                      {/* Sunrise Icon: Sun + Up Arrow logic abstract representation */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9V3m0 0l-3 3m3-3l3 3M3 17h18M5 17a7 7 0 0114 0"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-orange-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v6m0 0l-3-3m3 3l3-3M3 17h18M5 17a7 7 0 0114 0"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
            <div className="text-lg sm:text-xl text-white font-medium">
              {item.type === 'weather'
                ? `${Math.round(item.temp)}°`
                : item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
