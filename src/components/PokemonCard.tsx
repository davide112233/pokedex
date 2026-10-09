import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import PokemonModal from "./PokemonModal";
import GenerationFilter from "../components/GenerationFilter";
import type { Generation } from "../components/GenerationFilter";

export interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

const POKE_API = "https://pokeapi.co/api/v2";

const generationRanges: Record<
  Exclude<Generation, 0>,
  [number, number]
> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const getTypeColor = (type: string) => {
  return typeColors[type] ?? "#777777";
};

export const getCardBackground = (types: PokemonType[]) => {
  const firstType = types[0]?.type.name;
  const secondType = types[1]?.type.name;

  const firstColor = getTypeColor(firstType);

  if (!secondType) {
    return firstColor;
  }

  const secondColor = getTypeColor(secondType);

  return `linear-gradient(
    135deg,
    ${firstColor} 0%,
    ${firstColor} 50%,
    ${secondColor} 50%,
    ${secondColor} 100%
  )`;
};

export default function PokemonCard() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");

  // 0 = tutte le generazioni
  const [generation, setGeneration] = useState<Generation>(0);

  const [selectedPokemon, setSelectedPokemon] =
    useState<Pokemon | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${POKE_API}/pokemon?limit=2000`
        );

        if (!response.ok) {
          throw new Error(
            "Errore nel recupero dei Pokémon"
          );
        }

        const data: PokemonListResponse =
          await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);

            if (!response.ok) {
              throw new Error(
                `Errore nel recupero di ${pokemon.name}`
              );
            }

            return response.json();
          })
        );

        setPokemon(pokemonDetails);
      } catch (err) {
        console.error(err);
        setError(
          "Impossibile caricare i Pokémon."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  /*
   * Filtra i Pokémon in base a:
   * 1. nome cercato
   * 2. generazione selezionata
   */
  const filteredPokemon = pokemon.filter((poke) => {
    const matchesSearch = poke.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGeneration =
      generation === 0 ||
      (() => {
        const [min, max] =
          generationRanges[generation];

        return (
          poke.id >= min &&
          poke.id <= max
        );
      })();

    return (
      matchesSearch &&
      matchesGeneration
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">
          Caricamento Pokémon...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Filtro generazione */}
        <GenerationFilter
          generation={generation}
          setGeneration={setGeneration}
        />

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* Risultati */}
        {filteredPokemon.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-semibold text-gray-600">
              Nessun Pokémon trovato.
            </p>

            <p className="mt-2 text-gray-400">
              Prova a cercare un altro nome.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredPokemon.map((poke) => {
              const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;

              return (
                <div
                  key={poke.id}
                  onClick={() =>
                    setSelectedPokemon(poke)
                  }
                  className="
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    shadow-lg
                    transition
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                  style={{
                    background:
                      getCardBackground(
                        poke.types
                      ),
                  }}
                >
                  {/* Numero Pokédex */}
                  <div className="px-4 pt-4">
                    <span className="text-sm font-bold text-white/80">
                      #
                      {String(poke.id).padStart(
                        4,
                        "0"
                      )}
                    </span>
                  </div>

                  {/* Immagine */}
                  <div className="flex justify-center px-4 py-4">
                    <img
                      src={image}
                      alt={poke.name}
                      className="
                        h-40
                        w-40
                        object-contain
                        drop-shadow-xl
                      "
                      loading="lazy"
                    />
                  </div>

                  {/* Informazioni */}
                  <div className="bg-white/95 p-4">
                    <h2 className="text-center text-xl font-bold capitalize text-gray-800">
                      {poke.name}
                    </h2>

                    {/* Tipi */}
                    <div className="mt-3 flex justify-center gap-2">
                      {poke.types.map(
                        (type) => (
                          <span
                            key={type.slot}
                            className="
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-bold
                              uppercase
                              text-white
                              shadow
                            "
                            style={{
                              backgroundColor:
                                getTypeColor(
                                  type.type.name
                                ),
                            }}
                          >
                            {type.type.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modale */}
        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() =>
              setSelectedPokemon(null)
            }
            getTypeColor={getTypeColor}
            getCardBackground={
              getCardBackground
            }
          />
        )}
      </div>
    </div>
  );
}