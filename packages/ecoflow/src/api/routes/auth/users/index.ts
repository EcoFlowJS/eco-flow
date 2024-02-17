import { EcoRouter } from "../../../../service/EcoRouter";
import refreshToken from "../../../controllers/token/refreshToken";
import isAuthenticated from "../../../controllers/user/isAuthenticated";
import loginController from "../../../controllers/user/loginController";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get("/isAuthenticated", isAuthenticated);

userRouter.patch("/refreshToken", refreshToken);

userRouter.post("/login", loginController);
