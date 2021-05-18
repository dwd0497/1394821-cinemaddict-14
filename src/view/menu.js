import AbstractView from './abstract.js';

const createMenuItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  return (`
    <a href="${name}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>
  `);
};

const createMenuTemplate = (filters) => {
  const menuItemsTemplate = filters.map((filter, i) => createMenuItemTemplate(filter, i === 0)).join('');

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
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}
