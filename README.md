# [Pokede.xyz](Pokede.xyz) - The Ultimate Pokedex

A reponsive, single-page React web app, featuring a virtualized infinite scroll list component, that contains every single Pokemon to date - with each row displaying the Pokemon's name, ID, sprite & types.

![pokedex-readme-demo](https://user-images.githubusercontent.com/15115669/228356192-4e5a56b0-7ca9-4709-af51-4f75aef7ec3d.gif)

***
## Technologies/Frameworks Used

- React
- Vite
- TypeScript
- Node.js

### Libraries:
- [@tanstack/react-query](https://tanstack.com/query) - for fetching, React Suspense prefetching, caching & memoizing data, and its powerful `useInfiniteQuery` React hook
- [@tanstack/react-virtual](https://tanstack.com/virtual/v3) - for virtualizing the massive collection of pokemon data, which allows for super efficient/snappy infinite list rendering and a smooth scrolling experience
- Sass
- Bulma
- Lodash
## Local Installation/Usage

- Clone this repository to your machine
- Install dependencies by running `yarn` or `npm i` in the root directory
- Start the local development server with `yarn dev`
- Open your browser and go to http://localhost:5173 (or http://127.0.0.1:5173)
- `react-query` comes bundled with a great set of built-in devtools, which are currently enabled by default in the local dev environment - click on the pink flower icon at the bottom-left corner of the page to see the inner workings of RQ's brilliant client-side cache

Feel free to mess around with these params to see if you can further improve/optimize the data fetching and list rendering efficiency:
- `overscan` - the number of list items to render both above and below the the currently visible list items
- `FETCH_LIMIT` - the number of items to be fetched in each new set of Pokemon data
- `PREFETCH_IDX` - the number of rows from the bottom of the currently rendered list which, when its position is reached, triggers the next batch of Pokemon to be prefetched (higher values generally result in a longer load-times)

## Live Demo
Check out the live demo at <https://pokede.xyz>
***
*Thanks to [pokeapi.co](pokeapi.co) for providing the free Pokemon data API endpoints used in this application.*
