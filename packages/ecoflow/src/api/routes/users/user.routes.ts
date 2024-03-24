import { EcoRouter } from "../../../service/EcoRouter";
import fetchUserInfo from "../../controllers/user/fetchUserInfo.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";
import updateUserInfo from "../../controllers/user/updateUserInfo.controller";
import userPermissionsRouter from "./permissions/userPermissions.routes";
import userRolesRouter from "./roles/userRoles.routes";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get("/", isAuthenticated, fetchUserInfo);
userRouter.patch("/", isAuthenticated, updateUserInfo);

userRouter.use("/permissions", userPermissionsRouter.routes());
userRouter.use("/roles", userRolesRouter.routes());
