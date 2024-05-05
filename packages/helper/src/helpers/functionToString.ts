/**
 * Converts a function to a string representation.
 * @param {Function} value - The function to convert to a string.
 * @returns {string | unknown} The string representation of the function, or the original value if not a function.
 */
const functionToString = (value: Function): string | unknown => {
  if (typeof value === "function") return value.toString();
  return value;
};

export default functionToString;
