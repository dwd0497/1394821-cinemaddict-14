import FilmsBoardPresenter from './presenter/films-board.js';
import FilterPresenter from './presenter/filter.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import UserView from './view/user.js';
import StatisticsView from './view/statistics.js';
import StatView from './view/stat.js';

import {render, RenderPosition, replace} from './utils/render.js';
import {UpdateType} from './utils/consts.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic fdkoasngoinmo32mf';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);


const filmsModel = new FilmsModel();

const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

render(headerElement, new UserView());

const filmsBoardPresenter = new FilmsBoardPresenter(mainElement, filmsModel, filterModel, api);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, filmsBoardPresenter, commentsModel);
const statComponent = new StatView();
filterPresenter.init(statComponent);
filmsBoardPresenter.init(commentsModel);
render(mainElement, statComponent);

const statisticsComponent = new StatisticsView();
render(statisticsElement, statisticsComponent, RenderPosition.AFTEREND);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    replace(new StatisticsView(films.length), statisticsComponent);
    replace(new StatView(films), statComponent);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
