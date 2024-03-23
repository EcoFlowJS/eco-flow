import { EcoRouter } from "../../../service/EcoRouter";
import fetchUserInfo from "../../controllers/user/fetchUserInfo.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";
import userPermissionsRouter from "./permissions/userPermissions.routes";
import userRolesRouter from "./roles/userRoles.routes";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get("/user", isAuthenticated, fetchUserInfo);

userRouter.use("/permissions", userPermissionsRouter.routes());
userRouter.use("/roles", userRolesRouter.routes());
