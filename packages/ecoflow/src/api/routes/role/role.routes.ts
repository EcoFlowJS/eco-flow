import { EcoRouter } from "../../../service/EcoRouter";
import createRole from "../../controllers/role/createRole.controller";
import fetchRole from "../../controllers/role/fetchRole.controller";
import removeRole from "../../controllers/role/removeRole.controller";
import updateRole from "../../controllers/role/updateRole.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const roleRouter = EcoRouter.createRouter();
export default roleRouter;

roleRouter.get("/", isAuthenticated, fetchRole);
roleRouter.get("/:id", isAuthenticated, fetchRole);
roleRouter.post("/", isAuthenticated, createRole);
roleRouter.patch("/", isAuthenticated, updateRole);
roleRouter.delete("/:id", isAuthenticated, removeRole);
