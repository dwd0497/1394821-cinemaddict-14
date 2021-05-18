import MenuView from './view/menu.js';
import UserView from './view/user.js';
import SortView from './view/sort.js';
import FilmView from './view/film.js';
import FilmsContainerView from './view/films-container.js';
import DefaultFilmsView from './view/default-films.js';
import RatedFilmsView from './view/rated-films';
import CommentedFilmsView from './view/commented-films.js';
import NoFilmView from './view/no-film.js';
import FilmsView from './view/films.js';
import ShowMoreView from './view/show-more.js';
import PopupView from './view/popup.js';
import StatisticsView from './view/statistics.js';

import {generateFilm} from './mock/film.js';
import {generateFilters} from './mock/filter.js';
import {generateComments} from './mock/comment.js';

import {render, remove, removeChild} from './utils/render.js';

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

render(headerElement, new UserView());
render(mainElement, new MenuView(filters));
render(mainElement, new SortView());

const filmsComponent = new FilmsView();
render(mainElement, filmsComponent);

const defaultFilmsComponent = new DefaultFilmsView();
const ratedFilmsComponent = new RatedFilmsView();
const commentedFilmsComponent = new CommentedFilmsView();

if (films.length === 0) {
  render(filmsComponent, new NoFilmView());
} else {
  render(filmsComponent, defaultFilmsComponent);
  render(filmsComponent, ratedFilmsComponent);
  render(filmsComponent, commentedFilmsComponent);
}

const renderSeveralFilms = (count, container, films) => {
  const renderFilm = (film) => {
    const filmComponent = new FilmView(film);
    const popupComponent = new PopupView(film, comments);

    const openPopup = () => {
      footerElement.appendChild(popupComponent.getElement());
      document.body.classList.add('hide-overflow');
    };

    const closePopup = () => {
      removeChild(footerElement, popupComponent);
      document.body.classList.remove('hide-overflow');
    };

    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    filmComponent.setFilmClickHandler(() => {
      openPopup();
      document.addEventListener('keydown', onEscKeydown);
    });

    popupComponent.setCloseClickHandler(() => {
      closePopup();
      document.removeEventListener('keydown', onEscKeydown);
    });

    render(container, filmComponent);
  };

  for (let i = 0; i < Math.min(films.length, count); i++) {
    renderFilm(films[i]);
  }
};

const renderFilmsWithContainer = (count, container, films) => {
  const filmsContainerComponent = new FilmsContainerView();
  render(container, filmsContainerComponent);

  renderSeveralFilms(count, filmsContainerComponent, films);
};

renderFilmsWithContainer(DEFAULT_FILMS_COUNT, defaultFilmsComponent, films);

if (films.length > DEFAULT_FILMS_COUNT) {
  let renderedFilmsCount = DEFAULT_FILMS_COUNT;

  const showMoreComponent = new ShowMoreView();

  render(defaultFilmsComponent, showMoreComponent);

  showMoreComponent.setShowMoreHandler(() => {
    renderSeveralFilms(DEFAULT_FILMS_COUNT, defaultFilmsComponent.getElement().querySelector('.films-list__container'), films.slice(renderedFilmsCount, renderedFilmsCount + DEFAULT_FILMS_COUNT));

    renderedFilmsCount += DEFAULT_FILMS_COUNT;

    if (renderedFilmsCount >= films.length) {
      remove(showMoreComponent);
    }
  });
}

renderFilmsWithContainer(SPECIAL_FILMS_COUNT, ratedFilmsComponent, films);
renderFilmsWithContainer(SPECIAL_FILMS_COUNT, commentedFilmsComponent, films);

render(statisticsElement, new StatisticsView(films.length), 'afterend');
