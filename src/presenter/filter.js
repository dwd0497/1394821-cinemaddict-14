import Menu from '../view/menu.js';
import StatView from '../view/stat.js';

import {render, RenderPosition, replace} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../utils/consts.js';
import {PageType} from '../utils/consts.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, boardPresenter, commentsModel) {
    this._commentsModel = commentsModel;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._boardPresenter = boardPresenter;
    this._filterComponent = null;
    this._statComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handlePageTypeClick = this._handlePageTypeClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(mainElement) {
    const prevFilterComponent = this._filterComponent;
    const prevStatComponent = this._statComponent;

    this._mainElement = mainElement;
    this._statComponent = new StatView(this._getFilms());
    this._filterComponent = new Menu(this._getFilters(), this._filterModel.getFilter());
    this._filterComponent.setPageTypeClickHandler(this._handlePageTypeClick);
    this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
    } else {
      replace(this._filterComponent, prevFilterComponent);
    }

    if (prevStatComponent === null) {
      render(this._mainElement, this._statComponent);
    } else {
      replace(this._statComponent, prevStatComponent);
    }
  }

  _handleModelEvent() {
    this.init(this._mainElement);
  }

  _handleFilterTypeClick(filterType) {
    if (this._filmsModel.getFilms().length) {
      if (this._filterModel.getFilter() === filterType) {
        return;
      }
      this._statComponent.hide();
      this._boardPresenter.show();
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  _getFilters() {
    const films = this._getFilms();

    return [
      {
        type: FilterType.ALL,
        name: FilterType.ALL,
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handlePageTypeClick(pageItemType) {
    if (this._filmsModel.getFilms().length) {
      switch (pageItemType) {
        case PageType.FILMS:
          this._filterComponent.deleteActiveClass();
          this._filterComponent.setPageType(PageType.STATS);
          this._statComponent.show();
          this._boardPresenter.hide();
          break;
        case PageType.STATS:
          this._filterComponent.setPageType(PageType.FILMS);
          this._statComponent.hide();
          this._boardPresenter.show();
          break;
      }
    }
  }
}
