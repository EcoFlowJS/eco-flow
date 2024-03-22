import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const getDatabaseData = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName, collectionORtableName } = ctx.params;

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

  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: await new service.SchemaEditorService(connection).getDatabaseData(
      collectionORtableName
    ),
  };
};

export default getDatabaseData;
