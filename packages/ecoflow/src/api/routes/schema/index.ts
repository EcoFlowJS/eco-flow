import { EcoRouter } from "../../../service/EcoRouter";
import {
  createConnection,
  deleteConnection,
  getConnectionConfig,
  getConnectionConfigs,
  getConnections,
  updateConnection,
  getCollectionOrTable,
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
