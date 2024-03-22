import { Context } from "koa";
import path from "path";
import fse from "fs-extra";

const uploadImportFile = async (ctx: Context) => {
  const { userDir } = ecoFlow.config._config;
  const uploadDir = path.join(userDir!, "uploads");
  try {
    const importFile = ctx.request.files!.importFile as any;

    if (importFile.mimetype !== "application/x-zip-compressed") {
      ctx.body = {
        error: true,
        payload: "Invalid import file type. Expected zip file type.",
      };
      return;
    }

    const orginalFileName = importFile.originalFilename;
    const filePath = path.join(importFile.filepath);

    const name = `import_${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}_${new Date()
      .toLocaleTimeString("en-IN", {
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\:/g, "-")}_${orginalFileName}`;

    await fse.ensureDir(uploadDir);
    await fse.copyFile(filePath, path.join(uploadDir, name));
    await fse.unlink(filePath);

    ctx.body = {
      success: true,
      payload: { msg: "File uploaded successful.", newFileName: name },
    };
  } catch (e) {
    ctx.body = {
      error: true,
      payload: "Invalid import file type. Expected zip file type.",
    };
  }
};

export default uploadImportFile;
