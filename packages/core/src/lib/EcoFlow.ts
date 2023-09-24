import { EcoFlowArgs } from "../interfaces/EcoFlow.interface";

export class EcoFlow {
  constructor(args: EcoFlowArgs = {}) {
    if (args.hasOwnProperty("cli")) console.log(args.cli);
  }

  private init() {}

  start(): void {
    console.log("====================================");
    console.log("working...");
    console.log("====================================");
  }

  static get Version(): string {
    return "as";
  }
}
