import { EcoRouter } from "../../../service/EcoRouter";
import commitSaveTableColumn from "../../controllers/schema/commitSaveTableColumn.controller";
import createCollectionsORTable from "../../controllers/schema/createCollectionsORTable.controller";
import createConnection from "../../controllers/schema/createConnection.controller";
import deleteCollectionsORTable from "../../controllers/schema/deleteCollectionsORTable.controller";
import deleteConnection from "../../controllers/schema/deleteConnection.controller";
import deleteDatabaseData from "../../controllers/schema/deleteDatabaseData.controller";
import getCollectionOrTable from "../../controllers/schema/getCollectionOrTable.controller";
import getConnectionConfig from "../../controllers/schema/getConnectionConfig.controller";
import getConnections from "../../controllers/schema/getConnections.controller";
import getDatabaseData from "../../controllers/schema/getDatabaseData.controller";
import getTableColumnInfo from "../../controllers/schema/getTableColumnInfo.controller";
import insertDatabaseData from "../../controllers/schema/insertDatabaseData.controller";
import renameCollectionsORTable from "../../controllers/schema/renameCollectionsORTable.controller";
import updateConnection from "../../controllers/schema/updateConnection.controller";
import updateDatabaseData from "../../controllers/schema/updateDatabaseData.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const schemaRouter = EcoRouter.createRouter();
export default schemaRouter;

schemaRouter.get("/", (ctx) => (ctx.body = "Schema Router"));
schemaRouter.get("/connections", isAuthenticated, getConnections);
schemaRouter.post("/connection", isAuthenticated, createConnection);
schemaRouter.patch("/connection", isAuthenticated, updateConnection);
schemaRouter.delete(
  "/connection/:ConnectionName",
  isAuthenticated,
  deleteConnection
);

schemaRouter.get("/connectionConfigs", isAuthenticated, getConnectionConfig);
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
  "/collectionsORtables/:connectionName/:collectionOrTableName",
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
