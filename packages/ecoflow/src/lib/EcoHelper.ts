import { EcoHelper as IEcoHelper } from "@eco-flow/types";
import { loadEditor } from "../helper/loadEditor";
import EcoFlow from "./EcoFlow";
import { loadSystemRoutes } from "../helper/loadSystemRoutes";

export class EcoHelper implements IEcoHelper {
  private context: EcoFlow;
  constructor(context: EcoFlow) {
    this.context = context;
  }

  loadEditor(): void {
    loadEditor(this.context);
  }

  loadSystemRoutes(): void {
    loadSystemRoutes();
  }
}
