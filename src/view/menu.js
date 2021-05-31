import AbstractView from './abstract.js';
import {PageType} from '../utils/consts.js';

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
        <a href="#stats" class="main-navigation__additional" id="${PageType.FILMS}">Stats</a>
    </nav>
  `);
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._currentFilterType = currentFilterType;
    this._filters = filters;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._pageTypeClickHandler = this._pageTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType, this._currentPage);
  }

  _filterTypeClickHandler(evt) {
    this._callback.filterTypeClick(evt.currentTarget.getAttribute('data-type'));
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((element) => element.addEventListener('click', this._filterTypeClickHandler));
  }

  _pageTypeClickHandler(evt) {
    evt.preventDefault();
    this._callback.pageTypeClick(evt.target.id);
  }

  setPageTypeClickHandler(callback) {
    this._callback.pageTypeClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._pageTypeClickHandler);
  }

  setPageType(pageType) {
    const menuElement = this.getElement().querySelector('.main-navigation__additional')
    if (pageType === PageType.STATS) {
      menuElement.classList.add('main-navigation__additional--active');
      menuElement.id = PageType.STATS;
    } else {
      menuElement.classList.remove('main-navigation__additional--active');
      menuElement.id = PageType.FILMS;
    }
  }
}
