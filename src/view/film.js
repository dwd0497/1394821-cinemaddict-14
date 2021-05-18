import AbstractView from './abstract.js';

const restrictСharacters = (string) => {
  const MAX_STRING_LENGTH = 138;
  return string.length < MAX_STRING_LENGTH ? string : `${string.substring(0, MAX_STRING_LENGTH)} ...`;
};

const createFilmTemplate = (film) => {
  const {title, rating, releaseYear, duration, genres, poster, shortDescription, isWatched, isFavorite, isInWatchlist, comments} = film;

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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist  ${activeClassName(isInWatchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${activeClassName(isWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${activeClassName(isFavorite)}" type="button">Mark as favorite</button>
        </div>
    </article>
  `);
};

export default class Film extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._filmClickHandler = this._filmClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  _filmClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmClick();
  }

  setFilmClickHandler(callback) {
    this._callback.filmClick = callback;
    this.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments').forEach((elem) => {
      elem.addEventListener('click', this._filmClickHandler);
    });
  }
}
