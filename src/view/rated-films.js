import AbstractView from './abstract.js';

const createRatedFilmsTemplate = () => {
  return (`
    <section class="films-list films-list--extra" id="rated">
        <h2 class="films-list__title">Top rated</h2>
    </section>
`);
};

export default class RatedFilms extends AbstractView {
  getTemplate() {
    return createRatedFilmsTemplate();
  }
}
