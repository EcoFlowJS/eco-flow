import loadEditor from "../helper/editor.helper";
import EcoFlow from "./EcoFlow";
import loadSystemRoutes from "../helper/systemRoutes.helper";
import isCreateApp from "../helper/isCreateApp.helper";
import generateFiles from "../helper/generateFiles.helper";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import { isNewInitialization } from "../api/controller/base.controller";

export class EcoHelper {
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
