import { useState } from 'react';

interface FavoriteWeatherCardProps {
  locationName: string;
  nickname?: string;
  currentTemp: number;
  maxTemp: number;
  minTemp: number;
  weatherDescription: string;
  time: string;
  onRemove?: () => void;
  onClick?: () => void;
  onNicknameChange?: (newNickname: string) => void;
}

export function FavoriteWeatherCard({
  locationName,
  nickname,
  currentTemp,
  maxTemp,
  minTemp,
  weatherDescription,
  time,
  onRemove,
  onClick,
  onNicknameChange,
}: FavoriteWeatherCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nickname || locationName);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() && onNicknameChange) {
      onNicknameChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(nickname || locationName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="group relative overflow-hidden bg-black/10 rounded-[24px] p-6 cursor-pointer transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-black/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0 pr-4">
          {isEditing ? (
            <input
              type="text"
              className="bg-white/10 border border-white/30 rounded-lg px-2 py-1 text-xl font-bold text-white w-full outline-none transition-all focus:border-white/60 focus:bg-white/20 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 group/edit">
              <h3 className="text-xl font-bold m-0 text-white truncate drop-shadow-sm">
                {nickname || locationName}
              </h3>
              {onNicknameChange && (
                <button
                  className="opacity-100 md:opacity-0 md:group-hover/edit:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 rounded-full p-2 border-none cursor-pointer flex items-center justify-center text-xs text-white"
                  onClick={handleEditClick}
                  title="이름 수정"
                  aria-label="이름 수정"
                >
                  ✏️
                </button>
              )}
            </div>
          )}
          <p className="text-sm font-medium mt-1 text-white/70">{time}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-5xl font-light text-white leading-none tracking-tighter drop-shadow-md">
            {Math.round(currentTemp)}°
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4 mt-2">
        <span className="text-white/90 font-medium capitalize truncate max-w-[50%]">
          {weatherDescription}
        </span>
        <div className="flex items-center gap-3 text-sm font-medium text-white/80">
          <span>최고: {Math.round(maxTemp)}°</span>
          <span>최저: {Math.round(minTemp)}°</span>
        </div>
      </div>

      {onRemove && (
        <button
          className="absolute top-1 right-1 bg-white/10 hover:bg-red-500/20 hover:text-red-200 border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-lg text-white/70 leading-none transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:rotate-90"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="즐겨찾기 제거"
        >
          ✕
        </button>
      )}
    </div>
  );
}
