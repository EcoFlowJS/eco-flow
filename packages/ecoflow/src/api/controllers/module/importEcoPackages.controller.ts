import { ModuleSchema } from "@ecoflow/types";
import { Upload } from "@ecoflow/utils";
import { Context } from "koa";

const importEcoPackages = async (ctx: Context) => {
  const { ecoModule } = ecoFlow;
  if (ctx.request.files && ctx.request.files["packages"]) {
    const uploadedFiles = await new Upload(
      ctx.request.files["packages"]
    ).upload();

    const schemas: ModuleSchema[] = await ecoModule.installLocalModule(
      uploadedFiles
    );

    ecoModule.addModule(schemas);
  }
  ctx.body = {};
};

export default importEcoPackages;
