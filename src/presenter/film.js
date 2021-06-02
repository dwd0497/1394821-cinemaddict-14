import FilmView from '../view/film.js';
import PopupView from '../view/popup.js';

import {UserAction, UpdateType} from '../utils/consts.js';

import {render, remove, replace} from '../utils/render.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_SAVING: 'ABORTING_SAVING',
  ABORTING_DELETING: 'ABORTING_DELETING',
};

export default class Film {
  constructor(filmContainer, changeData, handleDestroyPopup, api) {
    this._api = api;
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
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(film, commentsModel) {
    this._film = film;
    this._commentsModel = commentsModel;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmView(this._film);

    this._filmComponent.setFilmClickHandler(this._handleFilmClick);
    this._filmComponent.setFilmFavoriteHandler(this._handleFavoriteClick);
    this._filmComponent.setFilmWatchedHandler(this._handleWatchedClick);
    this._filmComponent.setFilmWatchlistHandler(this._handleWatchlistClick);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  destroyPopup() {
    if (this._isPopupOpen === true) {
      this._closePopup();
    }
  }

  _openPopup(position = 0) {
    this._handleDestroyPopup();

    const prevPopupComponent = this._popupComponent;

    this._api.getComments(this._film.id).then((comments) => {
      this._commentsModel.setComments(comments);
      this._popupComponent = new PopupView(this._film, comments);
      this._popupComponent.setFormSubmitHandler(this._handleFormSubmit);
      this._popupComponent.setInputHandler(this._handleTextAreaInput);
      this._popupComponent.setDeleteClickHandler(this._handleDeleteClick);

      this._popupComponent.setFilmFavoriteHandler(this._handleFavoriteClick);
      this._popupComponent.setFilmWatchedHandler(this._handleWatchedClick);
      this._popupComponent.setFilmWatchlistHandler(this._handleWatchlistClick);
      this._popupComponent.setCloseClickHandler(this._handleCloseClick);

      this._addComment = this._addComment.bind(this._popupComponent);
      this._isPopupOpen = true;
      if (prevPopupComponent === null) {
        render(document.body, this._popupComponent);
      }
      document.body.classList.add('hide-overflow');
      this._popupComponent.getElement().scrollTo(0, position);
    });
  }

  _closePopup() {
    this.isPopupOpen = false;
    if (this._popupComponent) {
      remove(this._popupComponent);
    }
    this._popupComponent = null;
    document.body.classList.remove('hide-overflow');
  }

  _handleCloseClick() {
    this._popupComponent.reset(this._film);
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
      this._popupComponent.reset(this._film);
      this._closePopup();
      document.removeEventListener('keydown', this._escKeydownHandler);
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {isWatched: !this._film.isWatched}),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}),
    );
  }

  _restorePopup(position) {
    return () => {
      this.destroyPopup();
      this._openPopup(position);
    };
  }

  _deleteComment(deletedCommentElement) {
    return () => {
      deletedCommentElement.remove();
      this._popupComponent.recalculateCommentsCount(false);
    };
  }

  _addComment(comment) {
    this.recalculateCommentsCount(true);
    this.addNewComment(comment);
  }

  setViewState(state, comment) {
    const resetFormState = () => {
      this._popupComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._popupComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.ABORTING_SAVING:
        this._popupComponent.shakePopup(resetFormState);
        break;
      case State.ABORTING_DELETING:
        this._popupComponent.shakeComment(resetFormState, comment.id);
        break;
    }
  }

  _handleFormSubmit(comment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment,
      this._addComment,
      this._film,
      this,
    );
  }

  _handleDeleteClick(deletedComment, deletedCommentElement) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      deletedComment,
      this._deleteComment(deletedCommentElement),
      {...this._film, comments: this._film.comments.filter((id) => id !== deletedComment.id)},
    );
  }

  _handleTextAreaInput(evt) {
    this._popupComponent().querySelector('.film-details__comment-input').innerHTML = evt.target.value;
  }
}
