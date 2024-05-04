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

/* The is used to ensure that the file being exported does not have any exports.
It is a way to explicitly indicate that the file is not exporting anything,
which can be useful in certain scenarios to avoid unintentional exports or 
conflicts with other modules. */
export {};

/* Declaring a global variable `ecoFlow` of class `EcoFlow` in TypeScript.
It is also extending the NodeJS global namespace to include the `ecoFlow` variable 
with the same type definition. This allows the `ecoFlow` variable to be accessed
globally within the TypeScript project and also ensures that it is recognized as
part of the NodeJS global namespace. */
declare global {
  var ecoFlow: loadedEcoFlow;
  namespace NodeJS {
    interface Global {
      ecoFlow: loadedEcoFlow;
    }
  }
}
