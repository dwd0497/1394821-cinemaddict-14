import {createElement} from '../utils.js';

const createRatedFilmsTemplate = () => {
  return (`
    <section class="films-list films-list--extra" id="rated">
        <h2 class="films-list__title">Top rated</h2>
    </section>
`);
};

export default class RatedFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createRatedFilmsTemplate();
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
