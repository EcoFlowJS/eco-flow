export default (value: Function): string | unknown => {
  if (typeof value === "function") return value.toString();
  return value;
};
