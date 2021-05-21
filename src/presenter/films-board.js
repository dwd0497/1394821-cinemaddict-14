import FilmPresenter from './film.js';

import SortView from '../view/sort.js';
import FilmsContainerView from '../view/films-container.js';
import DefaultFilmsView from '../view/default-films.js';
import RatedFilmsView from '../view/rated-films';
import CommentedFilmsView from '../view/commented-films.js';
import NoFilmView from '../view/no-film.js';
import FilmsView from '../view/films.js';
import ShowMoreView from '../view/show-more.js';

import {render, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const DEFAULT_FILMS_COUNT = 5;
const SPECIAL_FILMS_COUNT = 2;

export default class FilmsBoard {
  constructor(filmsBoardContainer) {
    this._filmsBoardContainer = filmsBoardContainer;
    this._filmPresenter = {};

    this._filmsBoardComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleDestroyPopup = this._handleDestroyPopup.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  init(films, comments) {
    this._films = films;
    this._defaultFilms = films.slice(0, DEFAULT_FILMS_COUNT);
    this._specialFilms = films.slice(0, SPECIAL_FILMS_COUNT);
    this._comments = comments;

    this._renderSort();
    this._renderFilmsBoard(this._films);
  }

  _clearFilmList() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._filmPresenter = {};
    this._renderedFilmsCount = DEFAULT_FILMS_COUNT;
    remove(this._showMoreComponent);
  }

  _handleFilmChange(updatedFilm) {
    this._defaultFilms = updateItem(this._defaultFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm, this._comments);
  }

  _handleDestroyPopup() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.destroyPopup();
    });
  }

  _renderSort() {
    render(this._filmsBoardContainer, this._sortComponent);
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleDestroyPopup);
    filmPresenter.init(film, this._comments);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderSeveralFilms(count, container, films) {
    for (let i = 0; i < Math.min(films.length, count); i++) {
      this._renderFilm(films[i], container);
    }
  }

  _renderFilmsWithContainer(count, container, films) {
    const filmsContainerComponent = new FilmsContainerView();
    render(container, filmsContainerComponent);

    this._renderSeveralFilms(count, filmsContainerComponent, films);
  }

  _renderNoFilm() {
    render(this._filmsBoardComponent, this._noFilmComponent);
  }

  _renderDefaultFilms() {
    this._renderFilmsWithContainer(DEFAULT_FILMS_COUNT, this._defaultFilmsComponent, this._defaultFilms);
    this._renderShowMore();
  }

  _renderSpecialFilms(container) {
    this._renderFilmsWithContainer(SPECIAL_FILMS_COUNT, container, this._specialFilms);
  }

  _handleShowMoreClick() {
    this._renderSeveralFilms(DEFAULT_FILMS_COUNT, this._defaultFilmsComponent.getElement().querySelector('.films-list__container'), this._films.slice(this._renderedFilmsCount, this._renderedFilmsCount + DEFAULT_FILMS_COUNT));

    this._renderedFilmsCount += DEFAULT_FILMS_COUNT;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    this._renderedFilmsCount = DEFAULT_FILMS_COUNT;

    if (this._films.length > DEFAULT_FILMS_COUNT) {
      this._showMoreComponent = new ShowMoreView();

      render(this._defaultFilmsComponent, this._showMoreComponent);

      this._showMoreComponent.setShowMoreHandler(this._handleShowMoreClick);
    }
  }

  _renderFilmsBoard() {
    render(this._filmsBoardContainer, this._filmsBoardComponent);

    this._defaultFilmsComponent = new DefaultFilmsView();
    this._ratedFilmsComponent = new RatedFilmsView();
    this._commentedFilmsComponent = new CommentedFilmsView();

    if (this._films.length === 0) {
      this._renderNoFilm();
    } else {
      render(this._filmsBoardComponent, this._defaultFilmsComponent);
      render(this._filmsBoardComponent, this._ratedFilmsComponent);
      render(this._filmsBoardComponent, this._commentedFilmsComponent);
    }

    this._renderDefaultFilms();
    this._renderSpecialFilms(this._ratedFilmsComponent);
    this._renderSpecialFilms(this._commentedFilmsComponent);
  }
}
