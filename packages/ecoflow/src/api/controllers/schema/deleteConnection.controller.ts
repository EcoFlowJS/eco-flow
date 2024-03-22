import { Context } from "koa";

const deleteConnection = async (ctx: Context) => {
  const { _, database, service } = ecoFlow;
  const { ConnectionName } = ctx.params;
  const db = database.getDatabaseConnection(ConnectionName);
  if (_.isUndefined(db)) {
    ctx.body = {
      error: true,
      payload: {
        message: "Connection Name Not Found",
      },
    };
    return;
  }

  const [status, message] = await database.removeDatabaseConnection(
    ConnectionName
  );

  if (!status) {
    ctx.body = {
      error: true,
      payload: {
        message: message,
      },
    };
    return;
  }

  ctx.body = {
    success: true,
    payload: {
      message: message,
      connectionList: {
        payload: database.connectionList,
        count: database.counntConnections,
      },
    },
  };

  await service.AuditLogsService.addLog({
    message: `Database connection named ${ConnectionName} has been deleted`,
    type: "Info",
    userID: ctx.user,
  });
};

export default deleteConnection;
