import FilmsBoardPresenter from './presenter/films-board.js';
import FilterPresenter from './presenter/filter.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import UserView from './view/user.js';
import StatisticsView from './view/statistics.js';
import StatView from './view/stat.js';

import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comment.js';

import {render, RenderPosition} from './utils/render.js';

const FILMS_COUNT = 20;
const comments = generateComments();

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm(comments));

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

render(headerElement, new UserView());

const filmsBoardPresenter = new FilmsBoardPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, filmsBoardPresenter, commentsModel);
const statComponent = new StatView(films);
filterPresenter.init(statComponent);
filmsBoardPresenter.init(commentsModel);
render(mainElement, statComponent);

render(statisticsElement, new StatisticsView(films.length), RenderPosition.AFTEREND);
