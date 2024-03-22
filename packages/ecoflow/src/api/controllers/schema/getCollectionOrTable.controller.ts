import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const getCollectionOrTable = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const connection = database.getDatabaseConnection(ctx.params.connectionName);

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
    payload: await new service.SchemaEditorService(
      connection
    ).getCollectionOrTable(),
  };
};

export default getCollectionOrTable;
