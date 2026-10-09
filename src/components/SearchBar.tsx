interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative mx-auto max-w-xl">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cerca un Pokémon..."
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-5
            py-4
            pr-12
            text-lg
            text-gray-800
            shadow-md
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20
          "
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-2xl
              font-bold
              text-gray-400
              transition
              hover:text-gray-700
            "
            aria-label="Cancella ricerca"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}