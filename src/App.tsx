import { useState, useMemo } from 'react';
import { Sidebar } from './widgets/Sidebar';
import { WeatherDetailSection } from './widgets/WeatherDetailSection';
import { CurrentLocationWeather } from './widgets/CurrentLocationWeather';
import { useGeolocation } from './shared/hooks/useGeolocation';
import { useFavorites, type FavoriteLocation } from './features/favorites';

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState<FavoriteLocation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite, updateNickname, canAddMore } =
    useFavorites();

  // Derive current location data from favorites to get updates (like nickname changes)
  const currentSelectedLocation = useMemo(() => {
    if (!selectedLocation) return null;
    const favoriteMatch = favorites.find(
      (fav) => fav.id === selectedLocation.id
    );
    return favoriteMatch || selectedLocation;
  }, [selectedLocation, favorites]);

  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();

  const handleLocationSelect = (location: FavoriteLocation) => {
    setSelectedLocation(location);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Theme Handler
  const handleUpdateTheme = (isNight: boolean) => {
    if (isNight) {
      document.body.classList.add('night');
    } else {
      document.body.classList.remove('night');
    }
  };

  // Determine what to show in the main content
  const renderMainContent = () => {
    // If user selected a location from favorites, show that
    if (currentSelectedLocation) {
      return (
        <WeatherDetailSection
          cityName={currentSelectedLocation.city}
          locationName={
            currentSelectedLocation.nickname ||
            currentSelectedLocation.locationName
          }
          originalLocationName={
            currentSelectedLocation.nickname
              ? currentSelectedLocation.locationName
              : currentSelectedLocation.fullName
          }
          onUpdateTheme={handleUpdateTheme}
        />
      );
    }

    // If geolocation is loading, show loading state
    if (geoLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center">
          <p className="text-base sm:text-lg animate-pulse">
            현재 위치를 확인하는 중...
          </p>
        </div>
      );
    }

    // If we have geolocation, show current location weather
    if (latitude !== null && longitude !== null && !geoError) {
      return (
        <CurrentLocationWeather
          latitude={latitude}
          longitude={longitude}
          onUpdateTheme={handleUpdateTheme}
        />
      );
    }

    // If geolocation failed or has error, show permission message
    if (geoError) {
      // Check if it's a permission denied error
      const isPermissionDenied =
        geoError.includes('denied') || geoError.includes('Permission');

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/90 text-center px-4">
          <div className="max-w-md">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mb-5 opacity-60 mx-auto"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <h2 className="text-xl sm:text-2xl mb-3 font-semibold text-white">
              위치 권한을 설정해 주세요!
            </h2>
            <p className="opacity-80 mb-2 text-sm sm:text-base">
              {isPermissionDenied
                ? '브라우저 설정에서 위치 권한을 허용해주세요.'
                : '위치를 가져올 수 없습니다. 위치 서비스를 확인해주세요.'}
            </p>
            <div className="mt-6 p-4 bg-black/10 backdrop-blur-sm rounded-xl text-sm text-left max-w-md">
              <p className="mb-2 font-semibold">권한 설정 방법:</p>
              <ol className="m-0 pl-5 leading-relaxed">
                <li>브라우저 주소창 왼쪽의 🔒 아이콘 클릭</li>
                <li>"위치" 권한을 "허용"으로 변경</li>
                <li>페이지 새로고침</li>
              </ol>
            </div>
            <p className="mt-6 opacity-60 text-sm">
              또는 좌측에서 원하는 위치를 검색하여 선택하세요
            </p>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/80 text-center px-4">
        <p className="my-2 text-base sm:text-lg">좌측에서 위치를 선택하면</p>
        <p className="my-2 text-base sm:text-lg">
          상세 날씨 정보를 확인할 수 있습니다.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-transparent">
      {/* Mobile Header with Hamburger */}
      <header className="md:hidden flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <button
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">날씨</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <Sidebar
        onLocationSelect={handleLocationSelect}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        favorites={favorites}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        updateNickname={updateNickname}
        canAddMore={canAddMore}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
