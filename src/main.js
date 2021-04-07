import {createMenuTemplate} from './view/menu.js';
import {createUserTemplate} from './view/user.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmTemplate} from './view/film.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createDefaultFilmsTemplate} from './view/default-films.js';
import {createRatedFilmsTemplate} from './view/rated-films';
import {createCommentedFilmsTemplate} from './view/commented-films.js';
import {createFilmsTemplate} from './view/films.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createPopupTemplate} from './view/popup.js';
import {createStatisticsTemplate} from './view/statistics.js';

const DEFAULT_FILMS_COUNT = 5;
const SPECIAL_FILMS_COUNT = 2;

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createUserTemplate());
render(mainElement, createMenuTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmListElement = mainElement.querySelector('.films');

render(filmListElement, createDefaultFilmsTemplate());
render(filmListElement, createShowMoreTemplate());
render(filmListElement, createRatedFilmsTemplate());
render(filmListElement, createCommentedFilmsTemplate());

const defaultFilmsElement = filmListElement.querySelector('#default');
const ratedFilmsElement = filmListElement.querySelector('#rated');
const commentedFilmsElement = filmListElement.querySelector('#commented');

const renderSeveralFilms = (count, container) => {
  render(container, createFilmsContainerTemplate());
  const filmsContainerElement = container.querySelector('.films-list__container');
  for (let i = 0; i < count; i++) {
    render(filmsContainerElement, createFilmTemplate());
  }
};

renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsElement);

renderSeveralFilms(SPECIAL_FILMS_COUNT, ratedFilmsElement);
renderSeveralFilms(SPECIAL_FILMS_COUNT, commentedFilmsElement);

render(footerElement, createPopupTemplate(), 'afterend');

render(statisticsElement, createStatisticsTemplate(), 'afterend');
