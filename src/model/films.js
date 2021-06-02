import Observer from './observer.js';

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    let adaptedFilm = null;
    if (film.movie) {
      adaptedFilm = Object.assign(
        {},
        film,
        {
          film: {
            id: film.movie.id,
            title: film.movie.film_info.title,
            originalTitle: film.movie.film_info.alternative_title,
            poster: film.movie.film_info.poster,
            fullscreenPoster: film.movie.film_info.poster,
            rating: film.movie.film_info.total_rating,
            ageRating: film.movie.film_info.age_rating,
            releaseDate: new Date(film.movie.film_info.release.date),
            releaseYear: new Date(film.movie.film_info.release.date),
            country: film.movie.film_info.release.release_country,
            producer: film.movie.film_info.director,
            screenwriters: film.movie.film_info.writers,
            cast: film.movie.film_info.actors,
            duration: film.movie.film_info.runtime,
            genres: film.movie.film_info.genre,
            shortDescription: film.movie.film_info.description,
            description: film.movie.film_info.description,
            comments: film.movie.comments,
            isWatched: film.movie.user_details.already_watched,
            isFavorite: film.movie.user_details.favorite,
            isInWatchlist: film.movie.user_details.watchlist,
            watchingDate: new Date(film.movie.user_details.watching_date),
          },
          comment: {
            author: film.comments[film.comments.length - 1].author,
            text: film.comments[film.comments.length - 1].comment,
            date: film.comments[film.comments.length - 1].date,
            emotion: film.comments[film.comments.length - 1].emotion,
            id: film.comments[film.comments.length - 1].id,
          },
        },
      );
      delete adaptedFilm.movie;
      delete adaptedFilm.comments;
    } else {
      adaptedFilm = Object.assign(
        {},
        film,
        {
          id: film.id,
          title: film.film_info.title,
          originalTitle: film.film_info.alternative_title,
          poster: film.film_info.poster,
          fullscreenPoster: film.film_info.poster,
          rating: film.film_info.total_rating,
          ageRating: film.film_info.age_rating,
          releaseDate: new Date(film.film_info.release.date),
          releaseYear: new Date(film.film_info.release.date),
          country: film.film_info.release.release_country,
          producer: film.film_info.director,
          screenwriters: film.film_info.writers,
          cast: film.film_info.actors,
          duration: film.film_info.runtime,
          genres: film.film_info.genre,
          shortDescription: film.film_info.description,
          description: film.film_info.description,
          comments: film.comments,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          isInWatchlist: film.user_details.watchlist,
          watchingDate: new Date(film.user_details.watching_date),
        },
      );

      delete adaptedFilm.film_info;
      delete adaptedFilm.user_details;
    }

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film.id,
        'film_info': {
          title: film.title,
          'alternative_title': film.originalTitle,
          'total_rating': film.rating,
          poster: film.poster,
          'age_rating': film.ageRating,
          director: film.producer,
          writers: film.screenwriters,
          actors: film.cast,
          release: {
            date: film.releaseDate.toISOString(),
            'release_country': film.country,
          },
          runtime: film.duration,
          genre: film.genres,
          description: film.description,
        },
        'user_details': {
          watchlist: film.isInWatchlist,
          'already_watched': film.isWatched,
          'watching_date': film.watchingDate,
          favorite: film.isFavorite,
        },
      },
    );

    delete film.title;
    delete film.originalTitle;
    delete film.poster;
    delete film.fullscreenPoster;
    delete film.rating;
    delete film.ageRating;
    delete film.releaseDate;
    delete film.releaseYear;
    delete film.country;
    delete film.producer;
    delete film.screenwriters;
    delete film.cast;
    delete film.duration;
    delete film.genres;
    delete film.shortDescription;
    delete film.description;
    delete film.isWatched;
    delete film.isFavorite;
    delete film.isInWatchlist;
    delete film.watchingDate;

    return adaptedFilm;
  }
}
