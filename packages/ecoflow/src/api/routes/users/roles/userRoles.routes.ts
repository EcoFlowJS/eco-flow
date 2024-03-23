import { EcoRouter } from "../../../../service/EcoRouter";
import fetchRoles from "../../../controllers/user/fetchRoles.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const userRolesRouter = EcoRouter.createRouter();
export default userRolesRouter;

userRolesRouter.get("/", isAuthenticated, fetchRoles);
