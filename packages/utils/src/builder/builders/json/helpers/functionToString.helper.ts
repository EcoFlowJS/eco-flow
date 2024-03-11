export default function functionToString(value: Function): string | unknown {
  if (typeof value === "function") return value.toString();
  return value;
};
