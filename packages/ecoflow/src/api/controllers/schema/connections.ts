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

const getConnectionConfig = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  if (typeof ctx.params.id === "undefined") {
    ctx.body = {
      payload: [],
      count: 0,
    };
    return;
  }
  const ConnectionConfig = await database.getDatabaseConfig(ctx.params.id);
  ctx.body = {
    payload: ConnectionConfig,
    count: ConnectionConfig.length,
  };
};

const getConnectionConfigs = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  const ConnectionConfig = await database.getDatabaseConfig();
  ctx.body = {
    payload: ConnectionConfig,
    count: ConnectionConfig.length,
  };
};

const createConnection = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  try {
    const [name, driver, connection] = getConnectionsDetails(
      <ConnectionDefinations>ctx.request.body
    );

    const [status, message] = await database.addDatabaseConnection(
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
  const { database } = ecoFlow;
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

const deleteConnection = async (ctx: Context, next: Next) => {
  const { database, _ } = ecoFlow;
  const db = database.getDatabaseConnection(
    (<any>ctx.request.body!).ConnectionName
  );
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
    (<any>ctx.request.body!).ConnectionName
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
};

export {
  getConnectionConfig,
  getConnectionConfigs,
  getConnections,
  createConnection,
  updateConnection,
  deleteConnection,
};
