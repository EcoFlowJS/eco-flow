import EcoFlow from "./EcoFlow";
import isCreateApp from "../helper/isCreateApp.helper";
import generateFiles from "../helper/generateFiles.helper";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import { isNewInitialization } from "../api/controller/base.controller";
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
    if (this.context.isAuth) {
      EcoSystemAPIBuilder.register(
        new EcoSystemAPIBuilder().createGETRoute(
          "/isCreateApp",
          isNewInitialization
        ).route
      );
      return;
    }
    await generateFiles(this.context);
  }
}
