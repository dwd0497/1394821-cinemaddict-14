import {createElement} from '../utils.js';

const createDefaultFilmsTemplate = () => {
  return (`
    <section class="films-list" id="default">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
`);
};

export default class DefaultFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDefaultFilmsTemplate();
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
