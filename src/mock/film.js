
import {getRandomIntInclusive, getRandomArrayKey, getRandomLengthArray, getRandomYear, getRandomDate} from '../utils.js';

const titles = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];

const postersSrc = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const countrys = [
  'made-for-each-other',
  'popeye-meets-sinbad',
  'sagebrush-trail',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life',
  'the-great-flamarion',
  'the-man-with-the-golden-arm',
];

const people = [
  'Leonardo DiCaprio',
  'Tobey Maguire',
  'Carey Mulligan',
  'Joel Edgerton',
  'Isla Fisher',
  'Jason Clarke',
  'Elizabeth Debicki',
  'Adelaide Clemens',
  'Jack Thompson',
  'Max Cullen',
  'Callan McAuliffe',
  'Gus Murray',
  'Stephen James King',
];

const genres = [
  'Historical',
  'Animation',
  'Fantasy',
  'Drama',
  'Crime',
  'Horror',
  'Musicals',
];

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'.split('. ');

export const generateFilm = () => {
  return {
    title: getRandomArrayKey(titles),
    originalTtitle: getRandomArrayKey(titles),
    poster: getRandomArrayKey(postersSrc),
    fullcreanPoster: getRandomArrayKey(postersSrc),
    rating: getRandomIntInclusive(0, 10),
    ageRating: getRandomIntInclusive(0, 18),
    releaseDate: getRandomDate(),
    releaseYear: getRandomYear(),
    country: getRandomArrayKey(countrys),
    producer: getRandomArrayKey(people),
    screenwriters: getRandomLengthArray(people),
    cast: getRandomLengthArray(people),
    duration: `${getRandomIntInclusive(0, 8)}h ${getRandomIntInclusive(0, 59)}m`,
    genres: getRandomLengthArray(genres),
    shortDescription: getRandomLengthArray(description).join('. '),
    description: getRandomLengthArray(description).join('. '),
    comments: [1, 2, 3, 4],
    isWatched: Boolean(getRandomIntInclusive(0, 1)),
    isFavorite: Boolean(getRandomIntInclusive(0, 1)),
    isOnWatchlist: Boolean(getRandomIntInclusive(0, 1)),
  };
};
