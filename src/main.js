import {createMenuTemplate} from './view/menu.js';
import {createUserTemplate} from './view/user.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmListTemplate} from './view/film-list.js';
import {createFilmTemplate} from './view/film.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createPopupTemplate} from './view/popup.js';

const FILM_COUNT = 5;
const FILM_SPECIAL_COUNT = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

render(headerElement, createUserTemplate());
render(mainElement, createMenuTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmListTemplate());

const filmListElement = document.querySelector('.films-list');
const filmListContainerElements = document.querySelectorAll('.films-list__container');
const filmListContainerElement = filmListContainerElements[0];
const filmTopListContainerElement = filmListContainerElements[1];
const filmMostListContainerElement = filmListContainerElements[2];

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainerElement, createFilmTemplate());
}

render(filmListElement, createShowMoreTemplate());

for (let i = 0; i < FILM_SPECIAL_COUNT; i++) {
  render(filmTopListContainerElement, createFilmTemplate());
  render(filmMostListContainerElement, createFilmTemplate());
}

render(footerElement, createPopupTemplate(), 'afterend');

