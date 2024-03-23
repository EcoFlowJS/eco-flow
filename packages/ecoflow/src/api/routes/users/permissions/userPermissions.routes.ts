import { EcoRouter } from "../../../../service/EcoRouter";
import fetchPermissions from "../../../controllers/user/fetchPermissions.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const userPermissionsRouter = EcoRouter.createRouter();
export default userPermissionsRouter;

userPermissionsRouter.get("/", isAuthenticated, fetchPermissions);
userPermissionsRouter.get("/:mode", isAuthenticated, fetchPermissions);
