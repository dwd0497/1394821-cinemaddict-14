import AbstractView from './abstract.js';

const createMenuItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (`
    <a href="#${name.toLowerCase().match('[a-zA-Z]+')}" data-type="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>
  `);
};

const createMenuTemplate = (filters, currentFilterType) => {
  const menuItemsTemplate = filters.map((filter) => createMenuItemTemplate(filter, currentFilterType)).join('');

  return (`
    <nav class="main-navigation">
        <div class="main-navigation__items">
          ${menuItemsTemplate}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `);
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._currentFilterType = currentFilterType;
    this._filters = filters;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.getAttribute('data-type'));
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().querySelectorAll('a').forEach((element) => element.addEventListener('click', this._filterTypeClickHandler));
  }
}
