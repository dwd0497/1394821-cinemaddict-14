const restrictСharacters = (string) => {
  return string.length < 138 ? string : `${string.substr(0, 138)} ...`;
};

export const createFilmTemplate = (film) => {
  const {title, rating, releaseYear, duration, genres, poster, shortDescription, isWatched, isFavorite, isOnWatchlist, comments} = film;

  const activeClassName = (flag) => {
    return flag ? 'film-card__controls-item--active' : '';
  };

  return (`
    <article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres.length > 0 ? genres[0] : ''}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${restrictСharacters(shortDescription)}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist  ${activeClassName(isOnWatchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${activeClassName(isWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${activeClassName(isFavorite)}" type="button">Mark as favorite</button>
        </div>
    </article>
  `);
};
