import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const createCollectionsORTable = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName } = ctx.params;
  const connection = database.getDatabaseConnection(connectionName);

  if (typeof connection === "undefined") {
    ctx.status = 400;
    ctx.body = <ApiResponse>{
      error: true,
      payload: {
        msg: "Database connection not found or invalid",
      },
    };

    return;
  }

  try {
    const { name, tableLike } = ctx.request.body;
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).createCollectionsORTable(name, tableLike),
    };

    await service.AuditLogsService.addLog({
      message: `Table or Collection named ${name} has been created in database connection ${connectionName}`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default createCollectionsORTable;
