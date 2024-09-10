import { EcoRouter } from "../../../service/EcoRouter.js";
import commitSaveTableColumn from "../../controllers/schema/commitSaveTableColumn.controller.js";
import createCollectionsORTable from "../../controllers/schema/createCollectionsORTable.controller.js";
import createConnection from "../../controllers/schema/createConnection.controller.js";
import deleteCollectionsORTable from "../../controllers/schema/deleteCollectionsORTable.controller.js";
import deleteConnection from "../../controllers/schema/deleteConnection.controller.js";
import deleteDatabaseData from "../../controllers/schema/deleteDatabaseData.controller.js";
import getCollectionOrTable from "../../controllers/schema/getCollectionOrTable.controller.js";
import getConnectionConfig from "../../controllers/schema/getConnectionConfig.controller.js";
import getConnections from "../../controllers/schema/getConnections.controller.js";
import getDatabaseData from "../../controllers/schema/getDatabaseData.controller.js";
import getTableColumnInfo from "../../controllers/schema/getTableColumnInfo.controller.js";
import insertDatabaseData from "../../controllers/schema/insertDatabaseData.controller.js";
import renameCollectionsORTable from "../../controllers/schema/renameCollectionsORTable.controller.js";
import updateConnection from "../../controllers/schema/updateConnection.controller.js";
import updateDatabaseData from "../../controllers/schema/updateDatabaseData.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

const schemaRouter = EcoRouter.createRouter();
export default schemaRouter;

/**
 * Defines a route handler for GET requests to the root endpoint ("/") of the schemaRouter.
 * When a GET request is made to the root endpoint, it sets the response body to "Schema Router".
 * @param {Object} ctx - The context object representing the request and response context.
 * @returns None
 */
schemaRouter.get("/", (ctx) => (ctx.body = "Schema Router"));

/**
 * Route handler for GET requests to "/connections" endpoint.
 * This endpoint requires authentication before processing the request.
 * Calls the getConnections function to handle the request.
 */
schemaRouter.get("/connections", isAuthenticated, getConnections);

/**
 * Defines a POST route for creating a new connection in the schemaRouter.
 * @param {string} "/connection" - The endpoint for creating a new connection.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} createConnection - Handler function for creating a new connection.
 * @returns None
 */
schemaRouter.post("/connection", isAuthenticated, createConnection);

/**
 * PATCH route for updating a connection in the schema router.
 * @param {string} "/connection" - The endpoint for updating a connection.
 * @param {Function} isAuthenticated - Middleware function for authentication.
 * @param {Function} updateConnection - Controller function for updating a connection.
 * @returns None
 */
schemaRouter.patch("/connection", isAuthenticated, updateConnection);

/**
 * Defines a route to delete a connection based on the ConnectionName parameter.
 * @param {string} "/connection/:ConnectionName" - The route path with a parameter for ConnectionName.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} deleteConnection - Controller function to handle deletion of connection.
 * @returns None
 */
schemaRouter.delete(
  "/connection/:ConnectionName",
  isAuthenticated,
  deleteConnection
);

/**
 * Route handler for getting connection configurations.
 * @param {string} "/connectionConfigs" - The route path for getting connection configurations.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getConnectionConfig - Controller function to handle getting connection configurations.
 * @returns None
 */
schemaRouter.get("/connectionConfigs", isAuthenticated, getConnectionConfig);

/**
 * Route handler for getting connection configuration by ID.
 * @param {string} "/connectionConfig/:id" - The route path for getting connection configuration by ID.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getConnectionConfig - Controller function to handle getting connection configuration.
 * @returns None
 */
schemaRouter.get("/connectionConfig/:id", isAuthenticated, getConnectionConfig);

/**
 * Route handler for getting collections or tables for a specific connection.
 * @param {string} "/collectionsORtables/:connectionName" - The route path for the endpoint.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getCollectionOrTable - Controller function to get collections or tables.
 * @returns None
 */
schemaRouter.get(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  getCollectionOrTable
);

/**
 * POST endpoint for creating collections or tables for a given connection.
 * @param {string} "/collectionsORtables/:connectionName" - The route for creating collections or tables.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} createCollectionsORTable - Controller function for creating collections or tables.
 * @returns None
 */
schemaRouter.post(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  createCollectionsORTable
);

/**
 * PATCH endpoint for renaming collections or tables for a specific connection.
 * @param {string} "/collectionsORtables/:connectionName" - The route for the endpoint.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} renameCollectionsORTable - Controller function to handle renaming collections or tables.
 * @returns None
 */
schemaRouter.patch(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  renameCollectionsORTable
);

/**
 * DELETE request route for deleting a collection or table based on the connection name and collection/table name.
 * @param {string} "/collectionsORtables/:connectionName/:collectionOrTableName" - The route path for deleting a collection or table.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} deleteCollectionsORTable - Controller function to handle the deletion of a collection or table.
 * @returns None
 */
schemaRouter.delete(
  "/collectionsORtables/:connectionName/:collectionOrTableName",
  isAuthenticated,
  deleteCollectionsORTable
);

/**
 * Defines a route for retrieving information about the columns of a table in a database.
 * @param {string} "/tableColumn/:connectionName/:collectionORtableName" - The route path with parameters for connection name and table name/collection name.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} getTableColumnInfo - Controller function to handle the request and retrieve table column information.
 * @returns None
 */
schemaRouter.get(
  "/tableColumn/:connectionName/:collectionORtableName",
  isAuthenticated,
  getTableColumnInfo
);

/**
 * POST endpoint for saving table columns to a specific collection or table in the database.
 * @param {string} connectionName - The name of the database connection.
 * @param {string} collectionORtableName - The name of the collection or table to save the columns to.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} commitSaveTableColumn - Controller function to handle saving table columns.
 * @returns None
 */
schemaRouter.post(
  "/tableColumn/:connectionName/:collectionORtableName",
  isAuthenticated,
  commitSaveTableColumn
);

/**
 * Defines a route for retrieving data from a specific database collection or table.
 * @param {string} "/DatabaseData/:connectionName/:collectionORtableName" - The route path with parameters for connection name and collection/table name.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} getDatabaseData - Controller function to handle retrieving database data.
 * @returns None
 */
schemaRouter.get(
  "/DatabaseData/:connectionName/:collectionORtableName",
  isAuthenticated,
  getDatabaseData
);

/**
 * POST endpoint for inserting data into a specific collection/table in the database.
 * @param {string} "/DatabaseData/:connectionName/:collectionORtableName/insert" - The route for inserting data.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} insertDatabaseData - Controller function to handle inserting data into the database.
 * @returns None
 */
schemaRouter.post(
  "/DatabaseData/:connectionName/:collectionORtableName/insert",
  isAuthenticated,
  insertDatabaseData
);

/**
 * PATCH route for updating database data for a specific connection and collection/table.
 * @param {string} "/DatabaseData/:connectionName/:collectionORtableName/update" - The route path.
 * @param {function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {function} updateDatabaseData - Controller function to update database data.
 * @returns None
 */
schemaRouter.patch(
  "/DatabaseData/:connectionName/:collectionORtableName/update",
  isAuthenticated,
  updateDatabaseData
);

/**
 * DELETE endpoint for deleting data from a specific collection or table in the database.
 * @param {string} "/DatabaseData/:connectionName/:collectionORtableName/delete/:dataID" - The route for deleting data.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} deleteDatabaseData - Controller function to handle deletion of data.
 * @returns None
 */
schemaRouter.delete(
  "/DatabaseData/:connectionName/:collectionORtableName/delete/:dataID",
  isAuthenticated,
  deleteDatabaseData
);
