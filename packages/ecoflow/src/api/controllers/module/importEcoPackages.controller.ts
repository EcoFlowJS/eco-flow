import { ApiResponse, ModuleSchema } from "@ecoflow/types";
import { Upload } from "@ecoflow/utils";
import { Context } from "koa";

const importEcoPackages = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;

  try {
    if (
      _.isUndefined(ctx.request.files) ||
      _.isUndefined(ctx.request.files["packages"]) ||
      _.isEmpty(ctx.request.files["packages"])
    )
      throw "Packages is required.";

    const schemas: ModuleSchema[] = await ecoModule.installLocalModule(
      await new Upload(ctx.request.files["packages"]).upload()
    );
    ecoModule.addModule(schemas);

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: schemas.map((s) => s.module),
    };
    for await (const { module: installedModule } of schemas) {
      await service.AuditLogsService.addLog({
        message: `New local package(${installedModule?.name}) has been installed by ${ctx.user}`,
        type: "Info",
        userID: ctx.user,
      });
    }
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default importEcoPackages;
