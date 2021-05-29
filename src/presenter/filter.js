import Menu from '../view/menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
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

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handlePageTypeClick = this._handlePageTypeClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(statComponent) {
    const prevFilterComponent = this._filterComponent;
    this._statComponent = statComponent;
    this._filterComponent = new Menu(this._getFilters(), this._filterModel.getFilter());
    this._filterComponent.setPageTypeClickHandler(this._handlePageTypeClick);

    this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeClick(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

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
    switch (pageItemType) {
      case PageType.FILMS:
        this._filterComponent.setPageType();
        this._boardPresenter.destroy();
        this._statComponent.show();
        break;
      case PageType.STATS:
        this._filterComponent.setPageType();
        this._boardPresenter.init(this._commentsModel);
        this._statComponent.hide();
        break;
    }
  }
}
