import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const renameCollectionsORTable = async (ctx: Context) => {
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
    const { collectionTableOldName, collectionTableNewName } = ctx.request.body;
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).renameCollectionsORTable(
        collectionTableOldName,
        collectionTableNewName
      ),
    };

    await service.AuditLogsService.addLog({
      message: `Table or Collection renamed from ${collectionTableOldName} to ${collectionTableNewName} has been created in database connection ${connectionName}`,
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

export default renameCollectionsORTable;
