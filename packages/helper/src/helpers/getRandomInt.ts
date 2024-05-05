/**
 * Returns a random integer between the specified minimum and maximum values.
 * @param {number} min - The minimum value for the random integer (inclusive).
 * @param {number} max - The maximum value for the random integer (inclusive).
 * @returns A random integer between min and max (inclusive).
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default getRandomInt;
