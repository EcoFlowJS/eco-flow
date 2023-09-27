import { Config } from "../config";
import { EcoFlowArgs } from "@eco-flow/types";

export class EcoFlow {
  constructor(args: EcoFlowArgs = {}) {
    if (args.hasOwnProperty("cli")) console.log(args.cli);
  }

  private init() {}

  start(): void {
    console.log("====================================");
    console.log("working...");
    console.log("====================================");
    new Config();
  }

  static get Version(): string {
    return "as";
  }
}
