const filmsToFilterMap = {
  AllMovies: (films) => films.length,
  Watchlist: (films) => films.filter((film) => film.isOnWatchlist).length,
  History: (films) => films.filter((film) => film.isWatched).length,
  Favorites: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
