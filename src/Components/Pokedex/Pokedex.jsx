import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as _ from "lodash-es";

import List from "./List/List";
import "./pokedex.scss";
// import { usePokemonStore } from "../../store/pokemonStore.js";

const FETCH_LIMIT = 30;
const MAX_POKEMON = 1500;
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";



function Pokedex() {

  const [ pagesLoaded, setPagesLoaded ] = useState( 0 );
  // const [ pagesFetched, setPagesFetched ] = useState( 0 );
  const [ listProps, setlistProps ] = useState( null );

  //* Initial pokemon fetch after mount:
  // useEffect(() => {
  //   if ( !data ) return
  // }, [pagesLoaded ])

  // useEffect(() => {
  //   console.error("🚀🚀🚀 ~ useEffect ~ pagesFetched", pagesFetched);
  //   if ( pagesFetched >= 1 && data ) {
  //     // console.error(`🪵~🧮~🪵~🧮~🪵~🧮~🪵~🧮~🪵~🧮~🪵~🧮~🪵
  //     //   data =>
  //     //   ${data}
  //     // `);

  //     // const pokemonList = data.pages.flatMap((page) => page.pokemon);
  //     // const pokemonList = data.pages.map((page) => page.pokemon);
  //     const pokemonList = _.flatMap( data.pages, page => page.pokemon);

  //     // addPokemons( pokemonList );
  //     // console.error("🚀🚀🚀 ~ useEffect ~ pokemonList", pokemonList);

  //     // console.log( `useEffect pokemons`, JSON.stringify(pokemons, undefined, 2) );

  //     console.error("🚀🚀🚀 ~ useEffect");
  //   }
  // }, [pagesFetched]);

  // const [pokemons, addPokemons] = usePokemonStore((state) => [
  //   state.pokemons,
  //   state.addPokemons
  // ]);

  const fetchPokemonPage = async ({ pageParam = 1 }) => {
    console.log( `fetchPokemonPage ~ pageParam => ${pageParam}` );
    const offset = ( pageParam * FETCH_LIMIT ) - FETCH_LIMIT; // pg 1 = offset 0, pg 2 = offset 30, etc.
    const fetchParams = `?offset=${ offset }&limit=${ FETCH_LIMIT }`;
    const fetchUrl = BASE_URL + fetchParams;

    const response = await fetch( fetchUrl );
    if (!response.ok) {
      debugger;
      throw new Error("Failed to fetch Pokemon batch");
    }
    const data = await response.json();
    console.assert( !!data, `✅ data => ${data}` );

    return {
      pokemon: data.results,
      pageNo: pageParam,
      nextOffset: offset + data.results.length
    };
  };

  // const getPokemonDetails = async (url) => {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch Pokemon info");
  //   }
  //   const pokemonInfo = await response.json();

  //   console.log(`pokemonInfo`, JSON.stringify(pokemonInfo, undefined, 2));
  //   return pokemonInfo;
  // };

  //* Initial Fetch on Load:
  const {
    status,
    data,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // hasPreviousPage,
    // fetchPreviousPage,
    // isFetchingPreviousPage,
    } = useInfiniteQuery([ 'pokeData' ], fetchPokemonPage, {

        // select: data => ({
        //   console.log( `select` );
        // }),
        onSuccess: data => {
          console.error("🚀🚀🚀 ~ onSuccess ~ data", data);

          setPagesLoaded( pgs => {
              if ( data.pageParams.length !== pagesLoaded + 1 )
                debugger;

              else setPagesLoaded( data.pageParams.length );
          });
        },

        getNextPageParam: ( lastPage ) => {
          const nextPageParam = lastPage.pageNo + 1;
          console.info("🚀🚀🚀 useInfiniteQuery ~ nextPageParam", nextPageParam);
          return nextPageParam;
        },
        // getPreviousPageParam: (firstPage, lastPage, allPages) => {
        //   const ppp = firstPage.pageNo - 1;
        //   console.error("🚀🚀🚀 ~ Pokedex ~ ppp", ppp);
        //   return ppp;
        // },
        // useErrorBoundary
        // suspense
      }
    );

  const handleScroll = ev => {
    // console.count(`handleScroll`);

    const { scrollTop, clientHeight, scrollHeight } =ev.currentTarget;
    if (scrollHeight - (scrollTop + clientHeight) < 200 && hasNextPage) {
      console.log( `fetchNextPage` );
      debugger;

      fetchNextPage();
    }
  };

  const btnClasses = btn => {
    switch ( btn ) {
      case 'info':
        return 'button is-info';
      case 'loadMore':
        return 'button is-light ' + ( isLoading ? ' is-loading' : 'is-warning' );
      case 'danger':
        return 'button is-danger';
      case 'success':
        return 'button is-success';
      default:
        return 'button';
      }
  }

  function createListProps( pokeData ) {
    const parsed = _.flattenDeep(
      _.map( pokeData.pages, page =>
        _.map( page.pokemon, pokemon => ({
          name: _.capitalize( pokemon.name ),
          url: pokemon.url,
          id: _.nth( _.split( pokemon.url, "/"), -2 ),
        })
      ))
    )

      // console.log(`parsed`, JSON.stringify(parsed, undefined, 2));
      return parsed;

    // const pokemonDetails = d.pages.map((page, index) => (
    //   <li key={index}>
    //     {page.pokemon.map((pokemon) => (
    //       <div key={pokemon.name}>

    //         <img
    //           // src={`https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`}
    //           src={`https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`}
    //           alt={`${pokemon.name} sprite`}
    //         />
    //         {pokemon.name}
    //       </div>
    //     )
    //     )}
    //   </li>
    // ))

    // return pokemonDetails;
  }

  function resetList() {
    console.log(`resetList =>`);
  }

  if (error) return <div>Error fetching Pokemon data</div>;
  if (!data) return <div>Loading...</div>;

  const isLoading = status === 'loading';

  return (
    <div className="pokedex">
      <h1>POKEDEX</h1>

      <div className="pd-body container">

        {
          isFetching && (<div className="notification is-warning">
                            <button className="delete"></button>
                            FETCHING
                          </div>)
        }

        <div className="buttons">
          {/* <a
            className={ btnClasses( 'info' )}
            onClick={ ()=>{} }>
            { data ? "LOAD" : "NO DATA" }
          </a> */}
          <a
            className={ btnClasses( 'loadMore' )}
            onClick={ fetchNextPage }>
            { data && !isLoading ? "LOAD NEXT" : "NO MORE 2 LOAD" }
          </a>
          <a
            className={ btnClasses( 'danger' )}
            onClick={resetList}>
            RESET LIST
          </a>
        </div>


        <div
          className="pd-screen"
          onScroll={handleScroll}
        >
          <List pokeArray={ createListProps( data ) }/>
        </div>

      </div>
    </div>
  );
}

export default Pokedex
