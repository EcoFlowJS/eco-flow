import { EcoRouter } from "../../../service/EcoRouter";
import {
  createConnection,
  deleteConnection,
  getConnections,
  updateConnection,
} from "../../controllers/schema/connections";
import isAuthenticated from "../../controllers/user/isAuthenticated";

const schemaRouter = EcoRouter.createRouter();
export default schemaRouter;

schemaRouter.get("/", (ctx) => (ctx.body = "Schema Router"));
schemaRouter.get("/connections", isAuthenticated, getConnections);
schemaRouter.post("/connections", isAuthenticated, createConnection);
schemaRouter.put("/connections", isAuthenticated, updateConnection);
schemaRouter.delete("/connections", isAuthenticated, deleteConnection);
