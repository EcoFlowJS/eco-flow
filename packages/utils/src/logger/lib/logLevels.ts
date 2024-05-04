import { LogLevel as ILogLevel } from "@ecoflow/types";

/** This code snippet is defining a constant object named `LogLevel`.
 * The object has properties `ERROR`, `WARNING`, `INFO`, `VERBOSE`, and `DEBUG` with
 * corresponding numeric values assigned to them. This object is then exported for use in other parts
 * of the codebase.
 *
 *   Level         value
 *   ERROR           0
 *   WARNING         1
 *   INFO            2
 *   VERBOSE         4
 *   DEBUG           5
 */
export const LogLevel: ILogLevel = {
  ERROR: 0,
  WARNING: 1,
  INFO: 2,
  VERBOSE: 4,
  DEBUG: 5,
};
