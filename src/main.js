import FilmsBoardPresenter from './presenter/films-board.js';
import FilterPresenter from './presenter/filter.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import StatisticsView from './view/statistics.js';

import {render, RenderPosition} from './utils/render.js';
import {UpdateType} from './utils/consts.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic fdkoasngoinmo32mf';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);


const filmsModel = new FilmsModel();

const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const filmsBoardPresenter = new FilmsBoardPresenter(mainElement, filmsModel, filterModel, commentsModel, api);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, filmsBoardPresenter, commentsModel);

filterPresenter.init(mainElement);
filmsBoardPresenter.init(headerElement);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    const statisticsComponent = new StatisticsView(films.length);
    render(statisticsElement, statisticsComponent, RenderPosition.AFTEREND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
