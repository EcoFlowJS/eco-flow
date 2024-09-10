import EcoFlow from "./EcoFlow.js";
import isCreateApp from "../helper/isCreateApp.helper.js";
import generateFiles from "../helper/generateFiles.helper.js";
import { EcoEditors } from "../service/EcoEditors.js";

export class EcoHelper {
  private context: EcoFlow;
  constructor(context: EcoFlow) {
    this.context = context;
  }

  loadEditor(): void {
    new EcoEditors(this.context).loadEditors();
  }

  loadSystemRoutes(): void {
    EcoEditors.loadEditorsRoutes();
  }

  isCreateApp(): boolean {
    return isCreateApp();
  }

  async generateFiles(): Promise<void> {
    await generateFiles(this.context);
  }
}
