import { EcoRouter } from "../../../service/EcoRouter.js";
import backedFilesFetch from "../../controllers/backupRestore/backedFilesFetch.controller.js";
import backupRestoreStatus from "../../controllers/backupRestore/backupRestoreStatus.controller.js";
import generateBackupFile from "../../controllers/backupRestore/generateBackupFile.controller.js";
import removeBackedFile from "../../controllers/backupRestore/removeBackedFile.controller.js";
import restoreBackup from "../../controllers/backupRestore/restoreBackup.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

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
