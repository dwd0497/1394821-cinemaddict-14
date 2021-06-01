import SmartView from './smart.js';
import {emotions} from '../utils/consts.js';
import he from 'he';
import {convertMinutesToHours, formatDate, formatDateAndTime} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const getEmojisTemplate = (emotionsList, selectedEmotion) => {
  return emotionsList.map((emotion) => {
    return (`
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${selectedEmotion === emotion ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>
    `);
  }).join('');
};

const getGenresTemplate = (genres) => {
  const allGenres = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join('');

  return (`
  <tr class="film-details__row">
    <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
    <td class="film-details__cell">
      ${allGenres}
    </td>
  </tr>
`);
};

const getCommentsTemplate = (comments, isDisabled) => {
  return comments.map((comment) => {
    const {author, text, date, emotion, id} = comment;
    return (`
    <li class="film-details__comment" id="comment-${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formatDateAndTime(date)}</span>
        <button class="film-details__comment-delete" id="${id}" ${isDisabled ? 'disabled' : ''}>Delete</button>
        </p>
      </div>
    </li>
    `);
  }).join('');
};

const createPopupTemplate = (data, comments) => {
  const {title, originalTitle, rating, ageRating, producer, screenwriters, cast, releaseDate, country, duration, genres, poster, description, isWatched, isFavorite, isInWatchlist, selectedEmotion, comment, isDisabled} = data;

  const addCheckAttribute = (flag) => {
    return flag ? 'checked' : '';
  };

  return (`
        <section class="film-details">
            <form class="film-details__inner" action="" method="get">
            <div class="film-details__top-container">
                <div class="film-details__close">
                <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRating}+</p>
                </div>

                <div class="film-details__info">
                    <div class="film-details__info-head">
                    <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">${originalTitle}</p>
                    </div>

                    <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                    </div>
                    </div>

                    <table class="film-details__table">
                    <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${producer}</td>
                    </tr>
                    <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${screenwriters.join(', ')}</td>
                    </tr>
                    <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${cast.join(', ')}</td>
                    </tr>
                    <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${formatDate(releaseDate)}</td>
                    </tr>
                    <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${convertMinutesToHours(duration)}</td>
                    </tr>
                    <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                    </tr>

                    ${getGenresTemplate(genres)}

                    </table>
                    <p class="film-details__film-description">
                    ${description}
                    </p>
                </div>
                </div>

                <section class="film-details__controls">
                <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${addCheckAttribute(isInWatchlist)}>
                <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

                <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${addCheckAttribute(isWatched)}>
                <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

                <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${addCheckAttribute(isFavorite)}>
                <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
            </div>

            <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

                <ul class="film-details__comments-list">
                  ${getCommentsTemplate(comments, isDisabled)}
                </ul>

                <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">
                      ${selectedEmotion ? '<img src="images/emoji/' + selectedEmotion + '.png" width="55" height="55" alt="emoji-' + selectedEmotion + '"></img>' : ''}
                    </div>
                    <label class="film-details__comment-label">
                    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
                    </label>
                    <div class="film-details__emoji-list">
                      ${getEmojisTemplate(emotions, selectedEmotion)}
                    </div>
                </div>
                </section>
            </div>
            </form>
        </section>
  `);
};

export default class Popup extends SmartView {
  constructor(film, comments) {
    super();

    this._data = Popup.parseDataToState(film);
    this._comments = comments;
    this._newComment = {};
    this._textarea = '';

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);

    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emotionChangeHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      const currentOffset = this.getElement().scrollTop;
      this.updateData({selectedEmotion: evt.target.value});
      this._newComment.emoji = evt.target.value;
      this.getElement().scrollBy(0, currentOffset);
    }
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }

  _watchedChangeHandler(evt) {
    evt.preventDefault();
    this._callback.watchedChange();
  }

  _watchlistChangeHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistChange();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setFilmFavoriteHandler(callback) {
    this._callback.favoriteChange = callback;
    this.getElement().querySelector('#favorite').addEventListener('change', this._favoriteChangeHandler);
  }

  setFilmWatchedHandler(callback) {
    this._callback.watchedChange = callback;
    this.getElement().querySelector('#watched').addEventListener('change', this._watchedChangeHandler);
  }

  setFilmWatchlistHandler(callback) {
    this._callback.watchlistChange = callback;
    this.getElement().querySelector('#watchlist').addEventListener('change', this._watchlistChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emotionChangeHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);


    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((item) => {
      item.addEventListener('click', this._deleteClickHandler);
    });
    this.getElement().querySelector('form').addEventListener('keydown', (evt) => {
      if (evt.keyCode === 13 && (evt.ctrlKey || evt.metaKey) && !this._data.isSaving) {
        this._formSubmitHandler(evt);
      }
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._textInputHandler);
  }

  reset(film) {
    this.updateData(Popup.parseStateToData(film));
  }

  static parseDataToState(data) {
    return Object.assign({}, data, {selectedEmotion: null, comment: ''});
  }

  static parseStateToData(state) {
    const data = Object.assign({}, state);

    delete data.selectedEmotion;
    delete data.comment;

    return data;
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
  }

  _formSubmitHandler(evt) {
    const scrollPosition = this.getElement().scrollTop;
    evt.preventDefault();
    const {text, emoji} = this._newComment;

    if (!text.trim() || !emoji) {
      return;
    }

    this._callback.submit(this._newComment, scrollPosition);
  }

  setDeleteClickHandler(callback) {
    this._callback.delete = callback;
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    evt.target.textContent = 'Deleting';
    const scrollPosition = this.getElement().scrollTop;
    const deletedCommentId = evt.target.id;
    const deletedComment = this._comments.filter((comment) => comment.id === deletedCommentId)[0];
    this._callback.delete(deletedComment, scrollPosition);
  }

  setInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._textInputHandler);
  }

  _textInputHandler(evt) {
    evt.preventDefault();
    this._newComment.text = evt.target.value;
    this._textarea = evt.target.value;
  }

  shakePopup(callback) {
    const scrollPosition = this.getElement().scrollTop;
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
      this.getElement().scrollTo(0, scrollPosition);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeComment(callback, commentId) {
    const scrollPosition = this.getElement().scrollTop;
    this.getElement().querySelector(`#comment-${commentId}`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
      this.getElement().scrollTo(0, scrollPosition);
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
