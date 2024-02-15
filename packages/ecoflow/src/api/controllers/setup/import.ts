import { Context } from "koa";
import path from "path";
import fse from "fs-extra";
import StreamZip from "node-stream-zip";

const uploadImportFileController = async (ctx: Context) => {
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

const processImport = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { newFileName } = ctx.request.body;

  if (_.isEmpty(newFileName)) {
    ctx.body = {
      error: true,
      payload: "Error while Processing Import.",
    };
    return;
  }

  processImportSteps(newFileName);
  ctx.body = {
    success: true,
    payload: "Import File started processing...",
  };
};

const processImportSteps = async (fileName: string) => {
  const { config, server } = ecoFlow;
  const { userDir } = config._config;
  const { socket } = server;
  const uploadDir = path.join(userDir!, "uploads");
  const file = path.join(uploadDir, fileName);

  if (!(await fse.exists(file))) {
    setTimeout(
      () =>
        socket.emit("importFileSetup", {
          error: true,
          payload: "Import File does not exist or get corrupted.",
        }),
      500
    );
    return;
  }

  const zip = new StreamZip.async({ file: file });
  const entries = Object.keys(await zip.entries());
  if (
    !entries.includes("database.json") ||
    !entries.includes("flow.json") ||
    !entries.includes("packages.json") ||
    !entries.includes("server.json")
  ) {
    setTimeout(
      () =>
        socket.emit("importFileSetup", {
          error: true,
          payload:
            "Import File does not exist all requied files or get corrupted.",
        }),
      500
    );
    return;
  }

  //TODO: Complete the import file setup process.

  setTimeout(() => {
    socket.emit("importFileSetup", {
      success: true,
      payload: {
        msg: "Import File Process Success. Restarting in 5sec for deplying the import.",
        restart: true,
      },
    });
    setTimeout(() => server.restartServer(), 5000);
  }, 500);
};

export { uploadImportFileController, processImport };
