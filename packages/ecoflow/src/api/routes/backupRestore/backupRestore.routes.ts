import { EcoRouter } from "../../../service/EcoRouter";
import backedFilesFetch from "../../controllers/backupRestore/backedFilesFetch.controller";
import backupRestoreStatus from "../../controllers/backupRestore/backupRestoreStatus.controller";
import generateBackupFile from "../../controllers/backupRestore/generateBackupFile.controller";
import removeBackedFile from "../../controllers/backupRestore/removeBackedFile.controller";
import restoreBackup from "../../controllers/backupRestore/restoreBackup.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const backupRestoreRouter = EcoRouter.createRouter();
export default backupRestoreRouter;

backupRestoreRouter.get("/", isAuthenticated, backupRestoreStatus);

backupRestoreRouter.get("/backup", isAuthenticated, backedFilesFetch);
backupRestoreRouter.post("/backup", isAuthenticated, generateBackupFile);
backupRestoreRouter.delete(
  "/backup/:fileName",
  isAuthenticated,
  removeBackedFile
);

backupRestoreRouter.post("/restore", isAuthenticated, restoreBackup);
