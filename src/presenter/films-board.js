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
const FILM_COUNT_PER_STEP = 5;
const SPECIAL_FILMS_COUNT = 2;

export default class FilmsBoard {
  constructor(filmsBoardContainer) {
    this._filmsBoardContainer = filmsBoardContainer;
    this._filmPresenter = {};
    this._filmPresenterRated = {};
    this._filmPresenterCommented = {};

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
    this._ratedFilms = films.slice(0, SPECIAL_FILMS_COUNT);
    this._commentedFilms = films.slice(0, SPECIAL_FILMS_COUNT);
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
    this._films = updateItem(this._films, updatedFilm);
    if (updatedFilm.id in this._filmPresenter) {
      this._filmPresenter[updatedFilm.id].init(updatedFilm, this._comments);
    }
    if (updatedFilm.id in this._filmPresenterRated) {
      this._filmPresenterRated[updatedFilm.id].init(updatedFilm, this._comments);
    }
    if (updatedFilm.id in this._filmPresenterCommented) {
      this._filmPresenterCommented[updatedFilm.id].init(updatedFilm, this._comments);
    }
  }

  _handleDestroyPopup() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.destroyPopup();
    });
    Object.values(this._filmPresenterRated).forEach((presenter) => {
      presenter.destroyPopup();
    });
    Object.values(this._filmPresenterCommented).forEach((presenter) => {
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

  _renderRatedFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleDestroyPopup);
    filmPresenter.init(film, this._comments);
    this._filmPresenterRated[film.id] = filmPresenter;
  }

  _renderCommentedFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleDestroyPopup);
    filmPresenter.init(film, this._comments);
    this._filmPresenterCommented[film.id] = filmPresenter;
  }

  _renderFilmsContainer(container) {
    const filmsContainerComponent = new FilmsContainerView();
    render(container, filmsContainerComponent);

    return filmsContainerComponent;
  }

  _renderNoFilm() {
    render(this._filmsBoardComponent, this._noFilmComponent);
  }

  _renderDefaultFilms(count, films) {
    this._defaultFilmsContainer = this._renderFilmsContainer(this._defaultFilmsComponent);

    for (let i = 0; i < Math.min(films.length, count); i++) {
      this._renderFilm(films[i], this._defaultFilmsContainer);
    }
  }

  _renderRatedFilms(count, films) {
    const filmsContainer = this._renderFilmsContainer(this._ratedFilmsComponent);

    for (let i = 0; i < Math.min(films.length, count); i++) {
      this._renderRatedFilm(films[i], filmsContainer);
    }
  }

  _renderCommentedFilms(count, films) {
    const filmsContainer = this._renderFilmsContainer(this._commentedFilmsComponent);

    for (let i = 0; i < Math.min(films.length, count); i++) {
      this._renderCommentedFilm(films[i], filmsContainer);
    }
  }

  _handleShowMoreClick() {
    const prevRenderedFilmsCount = this._renderedFilmsCount;
    this._renderedFilmsCount += DEFAULT_FILMS_COUNT;

    if (prevRenderedFilmsCount <= this._films.length) {
      for (let i = 0; i < Math.min(this._films.slice(prevRenderedFilmsCount, this._renderedFilmsCount).length, this._renderedFilmsCount); i++) {
        this._renderFilm(this._films[i], this._defaultFilmsContainer);
      }
    }

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    if (this._films.length > FILM_COUNT_PER_STEP) {
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

    this._renderDefaultFilms(DEFAULT_FILMS_COUNT, this._defaultFilms);
    this._renderShowMore();
    this._renderRatedFilms(SPECIAL_FILMS_COUNT, this._ratedFilms);
    this._renderCommentedFilms(SPECIAL_FILMS_COUNT, this._commentedFilms);
  }
}
