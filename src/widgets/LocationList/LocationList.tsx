import type { LocationItem } from '../../shared/utils/locationSearch';

interface LocationListProps {
  locations: LocationItem[];
  onSelect: (location: LocationItem) => void;
}

export function LocationList({ locations, onSelect }: LocationListProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 bg-black/20 rounded-[20px] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
        {locations.map((location) => (
          <button
            key={location.fullName}
            className="w-full group flex items-center gap-3 px-4 py-3.5 bg-transparent border-none text-left cursor-pointer rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
            onClick={() => onSelect(location)}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
              <svg
                className="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-white group-hover:text-blue-100 transition-colors truncate">
                {location.name}
              </div>
              <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors truncate mt-0.5">
                {location.displayName}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
