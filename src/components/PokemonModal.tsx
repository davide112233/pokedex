import { useEffect } from "react";
import type { Pokemon, PokemonType } from "../components/PokemonCard";

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
  getTypeColor: (type: string) => string;
  getCardBackground: (types: PokemonType[]) => string;
}

export default function PokemonModal({
  pokemon,
  onClose,
  getTypeColor,
  getCardBackground,
}: PokemonModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Blocca lo scroll della pagina
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-0
        sm:p-4
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          flex
          max-h-screen
          w-full
          flex-col
          overflow-hidden
          bg-white
          shadow-2xl
          sm:max-h-[90vh]
          sm:max-w-2xl
          sm:rounded-3xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div
          className="
            relative
            shrink-0
            px-6
            pb-8
            pt-5
          "
          style={{
            background: getCardBackground(pokemon.types),
          }}
        >
          {/* Chiudi */}
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white/20
              text-2xl
              font-bold
              text-white
              transition
              hover:bg-white/30
            "
            aria-label="Chiudi"
          >
            ×
          </button>

          {/* Numero */}
          <span className="text-sm font-bold text-white/80">
            #{String(pokemon.id).padStart(4, "0")}
          </span>

          {/* Nome */}
          <h2 className="mt-2 text-3xl font-bold capitalize text-white sm:text-4xl">
            {pokemon.name}
          </h2>

          {/* Immagine */}
          <div className="flex justify-center">
            <img
              src={image}
              alt={pokemon.name}
              className="
                h-48
                w-48
                object-contain
                drop-shadow-2xl
                sm:h-56
                sm:w-56
              "
            />
          </div>

          {/* Tipi */}
          <div className="flex justify-center gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.slot}
                className="
                  rounded-full
                  px-4
                  py-1.5
                  text-xs
                  font-bold
                  uppercase
                  text-white
                  shadow
                "
                style={{
                  backgroundColor: getTypeColor(
                    type.type.name
                  ),
                }}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Contenuto */}
        <div className="overflow-y-auto p-5 sm:p-6">

          {/* Informazioni base */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            <div className="rounded-xl bg-gray-100 p-4 text-center">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Altezza
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {(pokemon.height / 10).toFixed(1)} m
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 p-4 text-center">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Peso
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>

            <div className="col-span-2 rounded-xl bg-gray-100 p-4 text-center sm:col-span-1">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Esperienza base
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {pokemon.base_experience}
              </p>
            </div>
          </div>

          {/* Abilità */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800">
              Abilità
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.ability.name}
                  className="
                    rounded-full
                    bg-gray-100
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    capitalize
                    text-gray-700
                  "
                >
                  {ability.ability.name.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Statistiche */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800">
              Statistiche
            </h3>

            <div className="mt-3 space-y-3">
              {pokemon.stats.map((stat) => {
                const percentage = Math.min(
                  (stat.base_stat / 255) * 100,
                  100
                );

                return (
                  <div key={stat.stat.name}>

                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium capitalize text-gray-600">
                        {stat.stat.name.replace("-", " ")}
                      </span>

                      <span className="font-bold text-gray-800">
                        {stat.base_stat}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getTypeColor(
                            pokemon.types[0]?.type.name
                          ),
                        }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}