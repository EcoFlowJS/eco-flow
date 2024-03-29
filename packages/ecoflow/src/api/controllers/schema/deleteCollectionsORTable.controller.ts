import { Context } from "koa";
import { ApiResponse } from "@ecoflow/types";

const deleteCollectionsORTable = async (ctx: Context) => {
  const { _, database, service } = ecoFlow;
  const { connectionName, collectionOrTableName } = ctx.params;
  const connection = database.getDatabaseConnection(connectionName);

  if (_.isUndefined(connection)) {
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
    if (_.isUndefined(collectionOrTableName))
      throw "Collection table not found";

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).deleteCollectionsORTable(collectionOrTableName),
    };

    await service.AuditLogsService.addLog({
      message: `Table or Collection named ${collectionOrTableName} has been deleted in database connection ${connectionName}`,
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

export default deleteCollectionsORTable;
