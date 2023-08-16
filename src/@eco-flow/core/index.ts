import { configSettings } from "@eco-flow/config";

export * from "./lib/EcoFlow";
declare global {
  var config: configSettings;
}
