import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

type Pokemon = {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attach: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

const PokemonContext = createContext({
  pokemon: [] as Pokemon[],
  search: '' as string,
  setSearch: Function as (search: string) => void,
});

const initialState = {
  pokemon: [] as Pokemon[],
  search: '' as string,
};

type PokemonState = {
  pokemon: Pokemon[];
  search: string;
};

type PokemonAction =
  | {
      type: 'setState';
      payload: Pokemon[];
    }
  | {
      type: 'setSearch';
      payload: string;
    };

const reducer = (state: PokemonState, action: PokemonAction) => {
  switch (action.type) {
    case 'setState':
      return { ...state, pokemon: action.payload };
    case 'setSearch':
      return { ...state, search: action.payload };
  }
};

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [{ pokemon, search }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('/pokemon.json')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'setState', payload: data }));
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'setSearch', payload: search });
  }, []);

  const filteredPokemon = useMemo(
    () => pokemon.filter((p) => p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())).slice(0, 20),
    [search, pokemon]
  );
  const sortedPokemon = useMemo(() => [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name)), [filteredPokemon]);

  return <PokemonContext.Provider value={{ pokemon: sortedPokemon, search, setSearch }}>{children}</PokemonContext.Provider>;
}

export const usePokemon = () => useContext(PokemonContext);
