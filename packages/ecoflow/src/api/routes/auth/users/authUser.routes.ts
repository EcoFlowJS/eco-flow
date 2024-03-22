import { EcoRouter } from "../../../../service/EcoRouter";
import refreshToken from "../../../controllers/user/refreshToken.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";
import userLogin from "../../../controllers/user/userLogin.controller";
import userLogout from "../../../controllers/user/userLogout.controller";

const authUserRouter = EcoRouter.createRouter();
export default authUserRouter;

authUserRouter.get("/isAuthenticated", isAuthenticated);

authUserRouter.patch("/refreshToken", refreshToken);

authUserRouter.post("/login", userLogin);

authUserRouter.delete("/logout", isAuthenticated, userLogout);
