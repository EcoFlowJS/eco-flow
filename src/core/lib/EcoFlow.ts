import { EcoFlowArgs } from "../interfaces/EcoFlow.interface";

export class EcoFlow {
  constructor(args: EcoFlowArgs = {}) {
    if (typeof args.hasOwnProperty("cli")) console.log(args.cli);
  }

  private init() {}

  start(): void {}

  static get Version(): string {
    return "as";
  }
}
