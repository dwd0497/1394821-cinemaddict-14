import {UserRank} from './consts.js';

const rankTable = {
  [UserRank.NOVICE]: (count) => count <= 10,
  [UserRank.FAN]: (count) => count <= 20 && count > 10,
  [UserRank.MOVIE_BUFF]: (count) => count > 20,
};

export const getRank = (films) => {
  const watchedFilmsCount = films.length;
  const [rankName] = Object.entries(rankTable)
    .filter(([, rankCount]) => rankCount(watchedFilmsCount))
    .flat();

  return rankName;
};
