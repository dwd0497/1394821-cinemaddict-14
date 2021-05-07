import {getRandomDate} from '../utils.js';
const generateCommen = () => {
  return {
    author: 'Tim Macoveev',
    text: 'Interesting setting and a good cast',
    date: getRandomDate(),
    emotion: 'smile',
  };
};

export const generateComments = () => {
  const comments = [];
  for (let i = 1; i < 5; i++) { // выведет 0, затем 1, затем 2
    const comment = generateCommen();
    comment.id = i;
    comments.push(comment);
  }
  return comments;
};
