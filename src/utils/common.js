import dayjs from 'dayjs';

export const getRandomIntInclusive = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayValue = (array) => {
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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

