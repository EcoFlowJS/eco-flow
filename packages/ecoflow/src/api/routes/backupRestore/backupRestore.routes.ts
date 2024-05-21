import { EcoRouter } from "../../../service/EcoRouter";
import backupRestoreStatus from "../../controllers/backupRestore/backupRestoreStatus.controller";
import generateBackupFile from "../../controllers/backupRestore/generateBackupFile.controller";
import restoreBackup from "../../controllers/backupRestore/restoreBackup.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const backupRestoreRouter = EcoRouter.createRouter();
export default backupRestoreRouter;

backupRestoreRouter.get("/", isAuthenticated, backupRestoreStatus);
backupRestoreRouter.post("/backup", isAuthenticated, generateBackupFile);
backupRestoreRouter.post("/restore", isAuthenticated, restoreBackup);
