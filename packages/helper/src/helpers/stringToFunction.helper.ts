export default (value: any): unknown => {
  try {
    value = eval(String(value));
  } catch (error) {
    value = value;
  }

  return value;
};
