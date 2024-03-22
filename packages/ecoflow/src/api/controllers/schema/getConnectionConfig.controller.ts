import { Context } from "koa";

const getConnectionConfig = async (ctx: Context) => {
  const { _, database } = ecoFlow;
  const { id } = ctx.params;

  ctx.status = 200;

  if (_.isUndefined(id)) {
    const ConnectionConfig = await database.getDatabaseConfig();
    ctx.body = {
      payload: ConnectionConfig,
      count: ConnectionConfig.length,
    };
    return;
  }

  const ConnectionConfig = await database.getDatabaseConfig(ctx.params.id);
  ctx.body = {
    payload: ConnectionConfig,
    count: ConnectionConfig.length,
  };
};

export default getConnectionConfig;
