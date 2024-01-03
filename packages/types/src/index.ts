import { loadedEcoFlow } from "./ecoflow";

export * from "./api";
export * from "./cli";
export * from "./database";
export * from "./ecoflow";
export * from "./helper";
export * from "./module";
export * from "./services";
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
