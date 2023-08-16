import * as InterFace from "../types/EcoFlow";
import { Config } from "@eco-flow/config";

export class EcoFlow implements InterFace.EcoFlow {
  constructor() {
    return this;
  }

  async start(): Promise<void> {
    try {
      let a = await new Config().deleteConfigFile("backup_1692204848130.json");
      console.log(a);
    } catch (error) {
      console.log(error);
    }
  }
}
