import FilmsBoardPresenter from './presenter/films-board.js';
import FilterPresenter from './presenter/filter.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import UserView from './view/user.js';
import StatisticsView from './view/statistics.js';

import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comment.js';

import {render, RenderPosition} from './utils/render.js';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const comments = generateComments();

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
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, filmsBoardPresenter);
filterPresenter.init();
filmsBoardPresenter.init(commentsModel);

render(statisticsElement, new StatisticsView(films.length), RenderPosition.AFTEREND);
