import { EcoRouter } from "../../../service/EcoRouter";
import {
  isServerOnline,
  serverCloseRestart,
} from "../../controllers/server/server.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated";

const serverRouter = EcoRouter.createRouter();
export default serverRouter;

serverRouter.post("/", isAuthenticated, serverCloseRestart);
serverRouter.get("/isOnline", isServerOnline);
