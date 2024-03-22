import { ConnectionDefinations } from "@eco-flow/types";
import getConnectionsDetails from "../../helpers/getDatabaseConnectionsDetails";
import { Context } from "koa";

const updateConnection = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  try {
    const [name, driver, connection] = getConnectionsDetails(
      <ConnectionDefinations>ctx.request.body
    );

    const [status, message] = await database.updateDatabaseConnection(
      name,
      driver,
      {
        ...connection,
      }
    );

    ctx.status = 200;
    if (!status) {
      ctx.body = {
        error: true,
        payload: {
          message: message,
        },
      };
    }

    if (status) {
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
        message: `Database connection named ${name} has been updated`,
        type: "Info",
        userID: ctx.user,
      });
    }
  } catch (err) {
    ctx.status = 200;
    ctx.body = {
      error: true,
      payload: {
        message: err,
      },
    };
  }
};

export default updateConnection;
