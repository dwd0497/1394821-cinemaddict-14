import AbstractView from './abstract.js';

const createStatisticsTemplate = (filmsCount) => {
  return (`
    <p>${filmsCount} movies inside</p>
  `);
};

export default class Statistics extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }
}
