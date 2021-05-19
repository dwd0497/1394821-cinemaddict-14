import {getRandomDate, getRandomArrayValue} from '../utils/common.js';
import {emotions} from '../utils/consts.js';

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

const generateComment = (id) => {
  return {
    author: getRandomArrayValue(people),
    text: getRandomArrayValue(comments),
    date: getRandomDate(),
    emotion: getRandomArrayValue(emotions),
    id: id,
  };
};

export const generateComments = () => {
  const commentsList = [];
  for (let i = 1; i < NUMBER_OF_COMMENTS; i++) {
    const comment = generateComment(i);
    commentsList.push(comment);
  }
  return commentsList;
};
