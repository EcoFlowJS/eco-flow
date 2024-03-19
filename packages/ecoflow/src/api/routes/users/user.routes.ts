import { EcoRouter } from "../../../service/EcoRouter";
import fetchPermissions from "../../controllers/user/fetchPermissions";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get("/permissions/:username", fetchPermissions);
