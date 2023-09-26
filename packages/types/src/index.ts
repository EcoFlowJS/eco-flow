import { ecoFlow } from "./core";

export * from "./cli";
export * from "./config";
export * from "./core";
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
