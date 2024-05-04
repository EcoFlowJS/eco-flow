/**
 * The function `stringToFunction` attempts to convert a string representation of a function into an
 * actual function using `eval`.
 * @param {any} value - The `stringToFunction` function takes in a parameter `value` of type `any`.
 * This function attempts to evaluate the `value` as a string representation of a function using the
 * `eval` function. If the evaluation is successful, the function returns the evaluated value. If an
 * error occurs during
 * @returns The function `stringToFunction` is returning the result of evaluating the input `value` as
 * a string using `eval()`. If the evaluation is successful, the result of the evaluation will be
 * returned. If an error occurs during evaluation, the original `value` will be returned.
 */
export default function stringToFunction(value: any): unknown {
  try {
    value = eval(String(value));
  } catch (error) {
    value = value;
  }

  return value;
}
