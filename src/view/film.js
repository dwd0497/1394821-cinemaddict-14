export const createFilmTemplate = () => {
  return (`
    <article class="film-card">
        <h3 class="film-card__title">Santa Claus Conquers the Martians</h3>
        <p class="film-card__rating">2.3</p>
        <p class="film-card__info">
        <span class="film-card__year">1964</span>
        <span class="film-card__duration">1h 21m</span>
        <span class="film-card__genre">Comedy</span>
        </p>
        <img src="./images/posters/santa-claus-conquers-the-martians.jpg" alt="" class="film-card__poster">
        <p class="film-card__description">The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…</p>
        <a class="film-card__comments">465 comments</a>
        <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
        </div>
    </article>
`);
};
