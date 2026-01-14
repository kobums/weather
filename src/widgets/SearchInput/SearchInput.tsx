interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = '검색',
}: SearchInputProps) {
  return (
    <div className="w-full">
      <div className="flex items-center bg-[#1c1c1e] rounded-xl px-3.5 py-2.5">
        <svg
          className="text-gray-500 mr-2 flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder:text-gray-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer p-0 ml-2 flex items-center justify-center"
            onClick={onClear}
            aria-label="검색어 지우기"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M15 9l-6 6M9 9l6 6"
                stroke="#1c1c1e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
