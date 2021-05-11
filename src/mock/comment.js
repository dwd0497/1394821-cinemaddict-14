import {getRandomDate, getRandomArrayKey} from '../utils.js';

const NUMBER_OF_COMMENTS = 5;

const comments = [
  'Interesting setting and a good cas',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
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

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const generateComment = (id) => {
  return {
    author: getRandomArrayKey(people),
    text: getRandomArrayKey(comments),
    date: getRandomDate(),
    emotion: getRandomArrayKey(emotions),
    id: id,
  };
};

export const generateComments = () => {
  const comments = [];
  for (let i = 1; i < NUMBER_OF_COMMENTS; i++) { // выведет 0, затем 1, затем 2
    const comment = generateComment(i);
    comments.push(comment);
  }
  return comments;
};
