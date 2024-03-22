import { EcoRouter } from "../../../service/EcoRouter";
import fetchPermissions from "../../controllers/user/fetchPermissions.controller";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get("/permissions/:username", fetchPermissions);
userRouter.get("/permissions/:username/:mode", fetchPermissions);
