import { useQueries } from '@tanstack/react-query';
import { weatherApi } from '../../shared/api/weatherApi';
import { FavoriteWeatherCard } from '../FavoriteWeatherCard';
import type { FavoriteLocation } from '../../features/favorites';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  onRemove: (id: string) => void;
  onCardClick?: (favorite: FavoriteLocation) => void;
  onNicknameUpdate?: (id: string, nickname: string) => void;
}

export function FavoritesList({
  favorites,
  onRemove,
  onCardClick,
  onNicknameUpdate,
}: FavoritesListProps) {
  const weatherQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ['weather', favorite.city],
      queryFn: () => weatherApi.getWeatherByCity(favorite.city),
      staleTime: 5 * 60 * 1000,
    })),
  });

  if (favorites.length === 0) {
    return (
      <div className="text-center py-14 px-5 text-white/60">
        <svg
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <p className="my-2 text-[15px]">즐겨찾기한 장소가 없습니다.</p>
        <p className="my-2 text-[15px]">
          장소를 검색하여 즐겨찾기에 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {favorites.map((favorite, index) => {
        const weatherQuery = weatherQueries[index];

        if (weatherQuery.isLoading) {
          return (
            <div
              key={favorite.id}
              className="relative bg-gradient-to-br from-blue-600/20 via-blue-700/15 to-blue-900/20 rounded-2xl p-5 backdrop-blur-md border border-white/10 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
                <div className="h-12 w-16 bg-white/20 rounded"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
            </div>
          );
        }

        if (weatherQuery.error || !weatherQuery.data) {
          return (
            <div
              key={favorite.id}
              className="relative bg-gradient-to-br from-blue-600/30 via-blue-700/25 to-blue-900/30 rounded-2xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-md border border-white/10 opacity-80 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-2xl"
              onClick={() => onCardClick?.(favorite)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold m-0 mb-1 text-white">
                    {favorite.nickname || favorite.locationName}
                  </h3>
                </div>
              </div>
              <p className="text-white/60 text-sm mt-2">데이터 없음</p>
              <button
                className="absolute top-2 right-2 bg-black/20 hover:bg-black/50 border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-xl text-white leading-none transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(favorite.id);
                }}
                aria-label="즐겨찾기 제거"
              >
                ×
              </button>
            </div>
          );
        }

        const data = weatherQuery.data;
        const time = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <FavoriteWeatherCard
            key={favorite.id}
            locationName={favorite.locationName}
            nickname={favorite.nickname}
            currentTemp={data.main.temp}
            maxTemp={data.main.temp_max}
            minTemp={data.main.temp_min}
            weatherDescription={data.weather[0]?.description || '정보 없음'}
            time={time}
            onRemove={() => onRemove(favorite.id)}
            onClick={() => onCardClick?.(favorite)}
            onNicknameChange={(newNickname) =>
              onNicknameUpdate?.(favorite.id, newNickname)
            }
          />
        );
      })}
    </div>
  );
}
