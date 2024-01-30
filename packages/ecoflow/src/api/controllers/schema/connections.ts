import Helper from "@eco-flow/helper";
import { Context, Next } from "koa";
import getConnectionsDetails from "./getConnectionsDetails";
import { ConnectionDefinations } from "@eco-flow/types";

const getConnections = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionList,
    count: database.counntConnections,
  };
};

const createConnection = async (ctx: Context, next: Next) => {
  try {
    const [name, driver, connection] = getConnectionsDetails(
      <ConnectionDefinations>ctx.request.body
    );

    const [status, message] = await ecoFlow.database.addDatabaseConnection(
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
        },
      };
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

const updateConnection = async (ctx: Context, next: Next) => {
  ctx.body = ctx.request.body;
};

const deleteConnection = async (ctx: Context, next: Next) => {
  ctx.body = ctx.request.body;
};

export { getConnections, createConnection, updateConnection, deleteConnection };
