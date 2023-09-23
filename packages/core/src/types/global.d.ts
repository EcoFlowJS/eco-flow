import { configSettings } from "@eco-flow/config";

export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  interface ecoFlow {
    config?: configSettings;
  }
  var { ecoFlow }: ecoFlow;
}
