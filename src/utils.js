import dayjs from 'dayjs';

export const getRandomIntInclusive = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayKey = (array) => {
  return array[getRandomIntInclusive(0, array.length - 1)];
};

export const getRandomLengthArray = (array) => {
  return new Array(getRandomIntInclusive(0, array.length - 1)).fill().map((item, i) => {
    return array[i];
  });
};


export const getRandomYear = () => {
  return dayjs().add(getRandomIntInclusive(-50, 0), 'year').format('YYYY');
};

export const getRandomDate = () => {
  return dayjs().add(getRandomIntInclusive(-  15000, 0), 'day').format('DD MMMM YYYY');
};


