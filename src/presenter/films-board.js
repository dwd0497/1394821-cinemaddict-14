import FilmPresenter, {State as FilmPresenterViewState} from './film.js';

import SortView from '../view/sort.js';
import FilmsContainerView from '../view/films-container.js';
import DefaultFilmsView from '../view/default-films.js';
import RatedFilmsView from '../view/rated-films';
import CommentedFilmsView from '../view/commented-films.js';
import NoFilmView from '../view/no-film.js';
import FilmsView from '../view/films.js';
import ShowMoreView from '../view/show-more.js';
import LoadingView from '../view/loading.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {sortByRating, sortByDate} from '../utils/common.js';
import {SortType, UpdateType, UserAction} from '../utils/consts.js';
import {filter} from '../utils/filter.js';

const DEFAULT_FILMS_COUNT = 5;
const FILM_COUNT_PER_STEP = 5;
const SPECIAL_FILMS_COUNT = 2;

export default class FilmsBoard {
  constructor(filmsBoardContainer, filmsModel, filterModel, api) {
    this._api = api;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsBoardContainer = filmsBoardContainer;
    this._filmPresenter = {};
    this._filmPresenterRated = {};
    this._filmPresenterCommented = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._sortComponent = null;
    this._showMoreComponent = null;

    this._loadingComponent = new LoadingView();
    this._filmsBoardComponent = new FilmsView();
    this._noFilmComponent = new NoFilmView();
    this._handleDestroyPopup = this._handleDestroyPopup.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init(commentsModel) {
    this._commentsModel = commentsModel;
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    render(this._filmsBoardContainer, this._filmsBoardComponent);
    this._renderFilmsBoard();
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedTasksCount: true, resetSortType: true});

    remove(this._filmsBoardComponent);
    remove(this._sortComponent);

    this._commentsModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _clearFilmList() {
    Object.values(this._filmPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._filmPresenter = {};
    this._renderedFilmsCount = DEFAULT_FILMS_COUNT;
    remove(this._showMoreComponent);
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

  _handleViewAction(actionType, updateType, update, callback, filmId) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        // this._filmPresenter[filmId].setViewState(FilmPresenterViewState.SAVING);
        this._api.addComment(update, filmId).then((response) => {
          this._commentsModel.addComment(updateType, response);
          callback();
        });
        break;
      case UserAction.DELETE_COMMENT:
        // this._filmPresenter[filmId].setViewState(FilmPresenterViewState.DELETING);
        this._api.deleteComment(update).then(() => {
          this._commentsModel.deleteComment(updateType, update);
          callback();
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmPresenter[data.id]) {
          this._filmPresenter[data.id].init(data, this._commentsModel);
        }
        if (this._filmPresenterRated[data.id]) {
          this._filmPresenterRated[data.id].init(data, this._commentsModel);
        }
        if (this._filmPresenterCommented[data.id]) {
          this._filmPresenterCommented[data.id].init(data, this._commentsModel);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedTasksCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsBoard({resetRenderedTasksCount: true});
    this._renderFilmsBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._filmsBoardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleDestroyPopup, this._api);
    filmPresenter.init(film, this._commentsModel);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderRatedFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleDestroyPopup, this._api);
    filmPresenter.init(film, this._commentsModel);
    this._filmPresenterRated[film.id] = filmPresenter;
  }

  _renderCommentedFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleDestroyPopup, this._api);
    filmPresenter.init(film, this._commentsModel);
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

  _renderSeveralFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderDefaultFilms() {
    const container = this._defaultFilmsContainer = this._renderFilmsContainer(this._defaultFilmsComponent);
    const filmsCount = this._getFilms().length;
    this._renderSeveralFilms(this._getFilms().slice(0, Math.min(filmsCount, DEFAULT_FILMS_COUNT)), container);
  }

  _renderRatedFilms() {
    const filmsContainer = this._renderFilmsContainer(this._ratedFilmsComponent);

    const ratedFilms = this._getFilms().slice(0, SPECIAL_FILMS_COUNT);

    for (let i = 0; i < Math.min(ratedFilms.length, SPECIAL_FILMS_COUNT); i++) {
      this._renderRatedFilm(ratedFilms[i], filmsContainer);
    }
  }

  _renderCommentedFilms() {
    const filmsContainer = this._renderFilmsContainer(this._commentedFilmsComponent);

    const commentedFilms = this._getFilms().slice(0, SPECIAL_FILMS_COUNT);

    for (let i = 0; i < Math.min(commentedFilms.length, SPECIAL_FILMS_COUNT); i++) {
      this._renderCommentedFilm(commentedFilms[i], filmsContainer);
    }
  }

  _handleShowMoreClick() {
    const filmCount = this._getFilms().length;
    const prevRenderedFilmsCount = this._renderedFilmsCount;
    this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);

    if (prevRenderedFilmsCount <= filmCount) {
      this._renderSeveralFilms(this._getFilms().slice(prevRenderedFilmsCount, this._renderedFilmsCount), this._defaultFilmsContainer);
    }

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._showMoreComponent = new ShowMoreView();

      render(this._defaultFilmsComponent, this._showMoreComponent);

      this._showMoreComponent.setShowMoreHandler(this._handleShowMoreClick);
    }
  }

  _renderLoading() {
    render(this._filmsBoardComponent, this._loadingComponent);
  }

  _clearFilmsBoard({resetRenderedTasksCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object.values(this._filmPresenter).forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._loadingComponent);
    remove(this._showMoreComponent);
    remove(this._defaultFilmsComponent);
    remove(this._ratedFilmsComponent);
    remove(this._commentedFilmsComponent);

    if (resetRenderedTasksCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const films = this._getFilms();
    const filmCount = films.length;

    this._defaultFilmsComponent = new DefaultFilmsView();
    this._ratedFilmsComponent = new RatedFilmsView();
    this._commentedFilmsComponent = new CommentedFilmsView();

    if (filmCount === 0) {
      this._renderNoFilm();
    } else {
      render(this._filmsBoardComponent, this._defaultFilmsComponent);
      render(this._filmsBoardComponent, this._ratedFilmsComponent);
      render(this._filmsBoardComponent, this._commentedFilmsComponent);
    }

    this._renderSort();
    this._renderDefaultFilms();
    this._renderShowMore();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }
}
