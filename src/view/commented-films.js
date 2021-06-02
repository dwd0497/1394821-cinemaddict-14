import AbstractView from './abstract.js';

const createCommentedFilmsTemplate = () => {
  return (`
    <section class="films-list films-list--extra" id="commented">
        <h2 class="films-list__title">Most commented</h2>
    </section>
`);
};

export default class CommentedFilms extends AbstractView {
  getTemplate() {
    return createCommentedFilmsTemplate();
  }
}
