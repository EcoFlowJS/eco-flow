import { ecoFlow } from "./ecoflow";

export * from "./cli";
export * from "./ecoflow";
export * from "./utils";

export {};

declare global {
  var ecoFlow: ecoFlow;
  namespace NodeJS {
    interface Global {
      strapi: ecoFlow;
    }
  }
}
