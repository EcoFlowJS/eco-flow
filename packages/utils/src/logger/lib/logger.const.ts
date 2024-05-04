/* This code snippet is defining a constant `LogLevelName` that is exported from the module.
It is an object where the keys are numbers and the values are strings. Each key corresponds to a
specific log level, and the value associated with each key is the name of that log level. */
export const LogLevelName: { [key: number]: string } = {
  0: "error",
  1: "warn",
  2: "info",
  4: "verbose",
  5: "debug",
};
