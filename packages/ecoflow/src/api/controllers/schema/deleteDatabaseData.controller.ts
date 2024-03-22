import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const deleteDatabaseData = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName, collectionORtableName, dataID } = ctx.params;

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
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).deleteDatabaseData(collectionORtableName, dataID),
    };
    await service.AuditLogsService.addLog({
      message: `Record deleted in table or collection named ${collectionORtableName} with id ${dataID} in database connection ${connectionName}`,
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

export default deleteDatabaseData;
