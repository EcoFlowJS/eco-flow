/**
 * The function `functionToString` takes a function as input and returns its string representation, or
 * the input value if it's not a function.
 * @param {Function} value - Function
 * @returns The function `functionToString` takes a value as input and checks if it is a function. If
 * it is a function, it returns the string representation of the function using the `toString()`
 * method. If the input value is not a function, it returns the input value itself.
 */
export default function functionToString(value: Function): string | unknown {
  if (typeof value === "function") return value.toString();
  return value;
}
