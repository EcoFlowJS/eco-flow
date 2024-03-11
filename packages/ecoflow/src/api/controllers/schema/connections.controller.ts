import { Context } from "koa";
import getConnectionsDetails from "../../helpers/getDatabaseConnectionsDetails";
import { ApiResponse, ConnectionDefinations } from "@eco-flow/types";

const getConnections = async (ctx: Context) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionList,
    count: database.counntConnections,
  };
};

const getConnectionConfig = async (ctx: Context) => {
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

const getConnectionConfigs = async (ctx: Context) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  const ConnectionConfig = await database.getDatabaseConfig();
  ctx.body = {
    payload: ConnectionConfig,
    count: ConnectionConfig.length,
  };
};

const createConnection = async (ctx: Context) => {
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

const updateConnection = async (ctx: Context) => {
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

const deleteConnection = async (ctx: Context) => {
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

const createCollectionsORTable = async (ctx: Context) => {
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

  try {
    const { name, tableLike } = ctx.request.body;
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).createCollectionsORTable(name, tableLike),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

const renameCollectionsORTable = async (ctx: Context) => {
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
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

const deleteCollectionsORTable = async (ctx: Context) => {
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

  try {
    const { collectionTable } = ctx.request.body;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).deleteCollectionsORTable(collectionTable),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

const getTableColumnInfo = async (ctx: Context) => {
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

  try {
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).getTableColumnInfo(collectionORtableName),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

const commitSaveTableColumn = async (ctx: Context) => {
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

  try {
    const { columnData } = ctx.request.body;
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).commitSaveTableColumn(collectionORtableName, columnData),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

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

const insertDatabaseData = async (ctx: Context) => {
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

  try {
    const { insertData } = ctx.request.body;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).insertDatabaseData(collectionORtableName, insertData),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

const updateDatabaseData = async (ctx: Context) => {
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

  try {
    const { oldData, newData } = ctx.request.body;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).updateDatabaseData(collectionORtableName, oldData, newData),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

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
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export {
  getConnectionConfig,
  getConnectionConfigs,
  getConnections,
  createConnection,
  updateConnection,
  deleteConnection,
  createCollectionsORTable,
  renameCollectionsORTable,
  deleteCollectionsORTable,
  commitSaveTableColumn,
  getTableColumnInfo,
  getCollectionOrTable,
  getDatabaseData,
  insertDatabaseData,
  updateDatabaseData,
  deleteDatabaseData,
};
