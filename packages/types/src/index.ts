import { loadedEcoFlow } from "./ecoflow";

export * from "./cli";
export * from "./ecoflow";
export * from "./utils";

export {};

declare global {
  var ecoFlow: loadedEcoFlow;
  namespace NodeJS {
    interface Global {
      ecoFlow: loadedEcoFlow;
    }
  }
}
