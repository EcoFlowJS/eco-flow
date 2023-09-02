import configSettings from "./config/sample.config";

export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  var config: configSettings;
}
