import { EcoRouter } from "../../../service/EcoRouter";
import isServerOnline from "../../controllers/server/isServerOnline.controller";
import serverCloseRestart from "../../controllers/server/serverCloseRestart.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const serverRouter = EcoRouter.createRouter();
export default serverRouter;

serverRouter.post("/", isAuthenticated, serverCloseRestart);
serverRouter.get("/isOnline", isServerOnline);
