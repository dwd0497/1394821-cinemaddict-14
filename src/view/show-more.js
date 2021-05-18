import AbstractView from './abstract.js';

const createShowMoreTemplate = () => {
  return (`
    <button class="films-list__show-more">Show more</button>
`);
};

export default class ShowMore extends AbstractView {
  constructor() {
    super();

    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  _showMoreClickHandler(evt) {
    evt.preventDefault();
    this._callback.showMoreClick();
  }

  setShowMoreHandler(callback) {
    this._callback.showMoreClick = callback;
    this.getElement().addEventListener('click', this._showMoreClickHandler);
  }
}
