import MenuView from './view/menu.js';
import UserView from './view/user.js';
import SortView from './view/sort.js';
import FilmView from './view/film.js';
import FilmsContainerView from './view/films-container.js';
import DefaultFilmsView from './view/default-films.js';
import RatedFilmsView from './view/rated-films';
import CommentedFilmsView from './view/commented-films.js';
import FilmsView from './view/films.js';
import ShowMoreView from './view/show-more.js';
import PopupView from './view/popup.js';
import StatisticsView from './view/statistics.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateComments} from './mock/comment.js';

import {render} from './utils.js';

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

render(headerElement, new UserView().getElement());
render(mainElement, new MenuView(filters).getElement());
render(mainElement, new SortView().getElement());

const filmsComponent = new FilmsView();
render(mainElement, filmsComponent.getElement());

const defaultFilmsComponent = new DefaultFilmsView();
const ratedFilmsComponent = new RatedFilmsView();
const commentedFilmsComponent = new CommentedFilmsView();

render(filmsComponent.getElement(), defaultFilmsComponent.getElement());
render(filmsComponent.getElement(), ratedFilmsComponent.getElement());
render(filmsComponent.getElement(), commentedFilmsComponent.getElement());

const renderSeveralFilms = (count, container, films) => {
  const filmsContainerComponent = new FilmsContainerView();
  render(container, filmsContainerComponent.getElement());

  const renderFilm = (film) => {
    const filmComponent = new FilmView(film);
    const popupComponent = new PopupView(film, comments);

    const openPopup = () => {
      footerElement.appendChild(popupComponent.getElement());
      document.body.classList.add('hide-overflow');
    };

    const closePopup = () => {
      footerElement.removeChild(popupComponent.getElement());
      document.body.classList.remove('hide-overflow');
    };

    filmComponent.getElement().querySelector('.film-card__poster, .film-card__title, .film-card__comments').addEventListener('click', () => {
      openPopup();
    });

    popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
    });

    render(filmsContainerComponent.getElement(), filmComponent.getElement());
  };

  for (let i = 0; i < Math.min(films.length, count); i++) {
    renderFilm(films[i]);
  }
};

renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsComponent.getElement(), films);

if (films.length > DEFAULT_FILMS_COUNT) {
  let renderedFilmsCount = DEFAULT_FILMS_COUNT;

  const showMoreComponent = new ShowMoreView();

  render(defaultFilmsComponent.getElement(), showMoreComponent.getElement());

  showMoreComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();

    renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsComponent.getElement(), films.slice(renderedFilmsCount, renderedFilmsCount + DEFAULT_FILMS_COUNT));

    renderedFilmsCount += DEFAULT_FILMS_COUNT;

    if (renderedFilmsCount >= films.length) {
      showMoreComponent.getElement().remove();
    }
  });
}

renderSeveralFilms(SPECIAL_FILMS_COUNT, ratedFilmsComponent.getElement(), films);
renderSeveralFilms(SPECIAL_FILMS_COUNT, commentedFilmsComponent.getElement(), films);

render(statisticsElement, new StatisticsView(films.length).getElement(), 'afterend');
