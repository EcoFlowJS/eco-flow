import { loadedEcoFlow } from "./ecoflow";

export * from "./api";
export * from "./cli";
export * from "./database";
export * from "./ecoflow";
export * from "./helper";
export * from "./module";
export * from "./flows";
export * from "./services";
export * from "./utils";

/**
 * This line is used to export an empty object, ensuring that this file is treated as a module.
 * This is commonly used in TypeScript files to prevent naming conflicts and to ensure proper module isolation.
 */
export {};

/**
 * Declares the global variable ecoFlow with the type loadedEcoFlow.
 * Extends the NodeJS global namespace to include the ecoFlow variable.
 */
declare global {
  var ecoFlow: loadedEcoFlow;
  namespace NodeJS {
    interface Global {
      ecoFlow: loadedEcoFlow;
    }
  }
}
