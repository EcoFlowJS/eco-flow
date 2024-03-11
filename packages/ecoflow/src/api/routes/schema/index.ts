import { EcoRouter } from "../../../service/EcoRouter";
import {
  createConnection,
  deleteConnection,
  getConnectionConfig,
  getConnectionConfigs,
  getConnections,
  updateConnection,
  getCollectionOrTable,
  getDatabaseData,
  createCollectionsORTable,
  renameCollectionsORTable,
  deleteCollectionsORTable,
  commitSaveTableColumn,
  getTableColumnInfo,
  insertDatabaseData,
  updateDatabaseData,
  deleteDatabaseData,
} from "../../controllers/schema/connections.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated";

const schemaRouter = EcoRouter.createRouter();
export default schemaRouter;

schemaRouter.get("/", (ctx) => (ctx.body = "Schema Router"));
schemaRouter.get("/connections", isAuthenticated, getConnections);
schemaRouter.post("/connection", isAuthenticated, createConnection);
schemaRouter.put("/connection", isAuthenticated, updateConnection);
schemaRouter.delete("/connection", isAuthenticated, deleteConnection);

schemaRouter.get("/connectionConfigs", isAuthenticated, getConnectionConfigs);
schemaRouter.get("/connectionConfig/:id", isAuthenticated, getConnectionConfig);

schemaRouter.get(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  getCollectionOrTable
);
schemaRouter.post(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  createCollectionsORTable
);
schemaRouter.patch(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  renameCollectionsORTable
);
schemaRouter.delete(
  "/collectionsORtables/:connectionName",
  isAuthenticated,
  deleteCollectionsORTable
);

schemaRouter.get(
  "/tableColumn/:connectionName/:collectionORtableName",
  isAuthenticated,
  getTableColumnInfo
);
schemaRouter.post(
  "/tableColumn/:connectionName/:collectionORtableName",
  isAuthenticated,
  commitSaveTableColumn
);

schemaRouter.get(
  "/DatabaseData/:connectionName/:collectionORtableName",
  isAuthenticated,
  getDatabaseData
);
schemaRouter.get(
  "/DatabaseData/:connectionName/:collectionORtableName/:subCollection",
  isAuthenticated,
  getDatabaseData
);
schemaRouter.get(
  "/DatabaseData/:connectionName/:collectionORtableName/:subCollection/:matchID",
  isAuthenticated,
  getDatabaseData
);
schemaRouter.post(
  "/DatabaseData/:connectionName/:collectionORtableName/insert",
  isAuthenticated,
  insertDatabaseData
);
schemaRouter.patch(
  "/DatabaseData/:connectionName/:collectionORtableName/update",
  isAuthenticated,
  updateDatabaseData
);
schemaRouter.delete(
  "/DatabaseData/:connectionName/:collectionORtableName/delete/:dataID",
  isAuthenticated,
  deleteDatabaseData
);
