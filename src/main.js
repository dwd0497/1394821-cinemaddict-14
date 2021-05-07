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

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateComments} from './mock/comment.js';

const FILMS_COUNT = 20;
const DEFAULT_FILMS_COUNT = 5;
const SPECIAL_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilters(films);
const comments = generateComments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createUserTemplate());
render(mainElement, createMenuTemplate(filters));
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmListElement = mainElement.querySelector('.films');

render(filmListElement, createDefaultFilmsTemplate());
render(filmListElement, createRatedFilmsTemplate());
render(filmListElement, createCommentedFilmsTemplate());

const defaultFilmsElement = filmListElement.querySelector('#default');
const ratedFilmsElement = filmListElement.querySelector('#rated');
const commentedFilmsElement = filmListElement.querySelector('#commented');

const renderSeveralFilms = (count, container, films) => {
  render(container, createFilmsContainerTemplate());

  const filmsContainerElement = container.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, count); i++) {
    render(filmsContainerElement, createFilmTemplate(films[i]));
  }
};

renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsElement, films);

if (films.length > DEFAULT_FILMS_COUNT) {
  let renderedFilmsCount = DEFAULT_FILMS_COUNT;

  render(defaultFilmsElement, createShowMoreTemplate());

  const showMoreElement = defaultFilmsElement.querySelector('.films-list__show-more');

  showMoreElement.addEventListener('click', (evt) => {
    evt.preventDefault();

    renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsElement, films.slice(renderedFilmsCount, renderedFilmsCount + DEFAULT_FILMS_COUNT));

    renderedFilmsCount += DEFAULT_FILMS_COUNT;

    if (renderedFilmsCount >= films.length) {
      showMoreElement.remove();
    }
  });
}


renderSeveralFilms(SPECIAL_FILMS_COUNT, ratedFilmsElement, films);
renderSeveralFilms(SPECIAL_FILMS_COUNT, commentedFilmsElement, films);

render(footerElement, createPopupTemplate(films[0], comments), 'afterend');

render(statisticsElement, createStatisticsTemplate(films.length), 'afterend');
