import {createElement} from '../utils.js';

const createCommentedFilmsTemplate = () => {
  return (`
    <section class="films-list films-list--extra" id="commented">
        <h2 class="films-list__title">Most commented</h2>
    </section>
`);
};

export default class CommentedFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCommentedFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
