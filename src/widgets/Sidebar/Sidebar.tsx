import { useState, useMemo } from 'react';
import { SearchInput } from '../SearchInput';
import { LocationList } from '../LocationList';
import { FavoritesList } from '../FavoritesList';
import {
  searchLocations,
  type LocationItem,
} from '../../shared/utils/locationSearch';
import type { FavoriteLocation } from '../../features/favorites';

interface SidebarProps {
  onLocationSelect?: (location: FavoriteLocation) => void;
  isOpen?: boolean;
  onClose?: () => void;
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, 'id'>) => boolean;
  removeFavorite: (id: string) => void;
  updateNickname: (id: string, nickname: string) => void;
  canAddMore: boolean;
}

export function Sidebar({
  onLocationSelect,
  isOpen = false,
  onClose,
  favorites,
  addFavorite,
  removeFavorite,
  updateNickname,
  canAddMore,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    return searchLocations(searchQuery);
  }, [searchQuery]);

  const handleLocationSelect = (location: LocationItem) => {
    if (canAddMore) {
      const added = addFavorite({
        locationName: location.name,
        city: location.city || location.fullName.split('-')[0],
        fullName: location.displayName,
      });

      if (added) {
        setSearchQuery('');
      }
    } else {
      alert('최대 6개까지 즐겨찾기에 추가할 수 있습니다.');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCardClick = (favorite: FavoriteLocation) => {
    onLocationSelect?.(favorite);
    onClose?.();
  };

  const handleNicknameUpdate = (id: string, nickname: string) => {
    updateNickname(id, nickname);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-80 lg:w-96 h-screen
          bg-gradient-to-b from-black/80 to-black/70 md:from-black/30 md:to-black/20
          border-r border-white/10
          overflow-y-auto flex-shrink-0 backdrop-blur-xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 md:p-5 lg:p-6">
          {/* Header */}
          <div className="mb-5 md:mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">
                날씨
              </h2>
              <p className="text-sm text-white/60">현재 위치와 즐겨찾기</p>
            </div>
            {/* Close button for mobile */}
            <button
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-5 md:mb-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleClearSearch}
            />
            {searchQuery && (
              <LocationList
                locations={searchResults}
                onSelect={handleLocationSelect}
              />
            )}
          </div>

          {/* Favorites Section */}
          {!searchQuery && (
            <div className="mt-5 md:mt-6">
              <FavoritesList
                favorites={favorites}
                onRemove={removeFavorite}
                onCardClick={handleCardClick}
                onNicknameUpdate={handleNicknameUpdate}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
