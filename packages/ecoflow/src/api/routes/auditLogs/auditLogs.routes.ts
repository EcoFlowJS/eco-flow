import { EcoRouter } from "../../../service/EcoRouter";
import fetchAuditLogs from "../../controllers/auditLogs/fetchAuditLogs.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const auditLogsRouter = EcoRouter.createRouter();
export default auditLogsRouter;

auditLogsRouter.get("/", isAuthenticated, fetchAuditLogs);
auditLogsRouter.get("/:page", isAuthenticated, fetchAuditLogs);
