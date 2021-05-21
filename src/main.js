import FilmsBoardPresenter from './presenter/films-board.js';

import MenuView from './view/menu.js';
import UserView from './view/user.js';
import StatisticsView from './view/statistics.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateComments} from './mock/comment.js';

import {render, RenderPosition} from './utils/render.js';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);
const comments = generateComments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

render(headerElement, new UserView());
render(mainElement, new MenuView(filters));

const filmsBoardPresenter = new FilmsBoardPresenter(mainElement);
filmsBoardPresenter.init(films, comments);

render(statisticsElement, new StatisticsView(films.length), RenderPosition.AFTEREND);
