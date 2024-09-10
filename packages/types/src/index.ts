import { loadedEcoFlow } from "./ecoflow/index.js";

export * from "./api/index.js";
export * from "./cli/index.js";
export * from "./database/index.js";
export * from "./ecoflow/index.js";
export * from "./helper/index.js";
export * from "./module/index.js";
export * from "./flows/index.js";
export * from "./services/index.js";
export * from "./utils/index.js";

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
