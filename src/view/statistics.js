import {createElement} from '../utils.js';

const createStatisticsTemplate = (filmsCount) => {
  return (`
    <p>${filmsCount} movies inside</p>
  `);
};

export default class Statistics {
  constructor(filmsCount) {
    this._element = null;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
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
