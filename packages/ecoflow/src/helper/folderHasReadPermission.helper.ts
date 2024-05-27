import fse, { Dirent } from "fs-extra";
import path from "path";

const folderHasReadPermission = (dirent: Dirent): boolean => {
  try {
    fse.readdirSync(
      path.join(dirent.path || dirent.parentPath || "/", dirent.name)
    );
    return true;
  } catch {
    return false;
  }
};

export default folderHasReadPermission;
