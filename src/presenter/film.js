import FilmView from '../view/film.js';
import PopupView from '../view/popup.js';

import {render, remove, replace} from '../utils/render.js';

export default class Film {
  constructor(filmContainer, changeData, handleDestroyPopup) {
    this._isPopupOpen = false;
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._handleDestroyPopup = handleDestroyPopup;

    this._filmComponent = null;
    this._popupComponent = null;

    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFilmClick = this._handleFilmClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmView(this._film);
    this._popupComponent = new PopupView(this._film, this._comments);

    this._filmComponent.setFilmClickHandler(this._handleFilmClick);
    this._filmComponent.setFilmFavoriteHandler(this._handleFavoriteClick);
    this._filmComponent.setFilmWatchedHandler(this._handleWatchedClick);
    this._filmComponent.setFilmWatchlistHandler(this._handleWatchlistClick);
    this._popupComponent.setFilmFavoriteHandler(this._handleFavoriteClick);
    this._popupComponent.setFilmWatchedHandler(this._handleWatchedClick);
    this._popupComponent.setFilmWatchlistHandler(this._handleWatchlistClick);

    if (prevFilmComponent === null || prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (document.body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._prevPopupComponent);
  }

  destroyPopup() {
    if (this._isPopupOpen === true) {
      this._closePopup();
    }
  }

  _openPopup() {
    this._handleDestroyPopup();
    this._isPopupOpen = true;
    render(document.body, this._popupComponent);
    document.body.classList.add('hide-overflow');
    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
  }

  _closePopup() {
    this.isPopupOpen = false;
    remove(this._popupComponent);
    document.body.classList.remove('hide-overflow');
  }

  _handleCloseClick() {
    this._closePopup();
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _handleFilmClick() {
    this._openPopup();
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener('keydown', this._escKeydownHandler);
    }
  }

  _handleFavoriteClick() {
    const newFilmData = Object.assign({}, this._film, {isFavorite: !this._film.isFavorite});
    this._changeData(newFilmData);
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign({}, this._film, {isWatched: !this._film.isWatched}),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}),
    );
  }
}
