import EcoFlow from "./EcoFlow";
import isCreateApp from "../helper/isCreateApp.helper";
import generateFiles from "../helper/generateFiles.helper";
import { EcoEditors } from "../service/EcoEditors";

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
