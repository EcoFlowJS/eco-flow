export const stringToFunction = (value: any): unknown => {
  try {
    value = eval(String(value));
  } catch (error) {
    value = value;
  }

  return value;
};

export const functionToString = (value: Function): string | unknown => {
  if (typeof value === "function") return value.toString();
  return value;
};
