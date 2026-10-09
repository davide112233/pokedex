import type { Dispatch, SetStateAction } from "react";

export type Generation =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9;

interface GenerationFilterProps {
  generation: Generation;
  setGeneration: Dispatch<SetStateAction<Generation>>;
}

export default function GenerationFilter({
  generation,
  setGeneration,
}: GenerationFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      {/* Tutti */}
      <button
        onClick={() => setGeneration(0)}
        className={`rounded-full px-4 py-2 font-bold transition ${
          generation === 0
            ? "bg-gray-800 text-white shadow-lg"
            : "bg-white text-gray-700 shadow hover:bg-gray-200"
        }`}
      >
        Tutti
      </button>

      {/* Generazioni */}
      {Array.from({ length: 9 }, (_, index) => index + 1).map(
        (gen) => (
          <button
            key={gen}
            onClick={() => setGeneration(gen as Generation)}
            className={`rounded-full px-4 py-2 font-bold transition ${
              generation === gen
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow hover:bg-gray-200"
            }`}
          >
            Gen {gen}
          </button>
        )
      )}
    </div>
  );
}