/**
 * Converts a string representation of a function to an actual function.
 * @param {any} value - The string representation of the function.
 * @returns {unknown} The converted function or the original value if conversion fails.
 */
const stringToFunction = (value: any): unknown => {
  try {
    value = eval(String(value));
  } catch (error) {
    value = value;
  }

  return value;
};

export default stringToFunction;
