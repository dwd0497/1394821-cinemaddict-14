import AbstractView from './abstract.js';

const createDefaultFilmsTemplate = () => {
  return (`
    <section class="films-list" id="default">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
`);
};

export default class DefaultFilms extends AbstractView {
  getTemplate() {
    return createDefaultFilmsTemplate();
  }
}
