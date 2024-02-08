import { EcoRouter } from "../../../service/EcoRouter";
import mime from "mime";
import fse from "fs-extra";
import path from "path";
import { databaseValidator } from "../../controllers/setup/database";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

setupRouter.get(["/", "/home"], (ctx) => ctx);

setupRouter.post("/database/validate", databaseValidator);

setupRouter.post("/import", async (ctx) => {
  const { userDir } = ecoFlow.config._config;
  const file = ctx.request.files!.file as any;
  console.log(file);

  const type = mime.extension(file.mimetype);
  const name = file.originalFilename;
  const filePath = path.join(file.filepath);

  await fse.ensureDir(path.join(userDir!, "temp"));
  await fse.copyFile(filePath, path.join(userDir!, "temp", name));
  await fse.unlink(filePath);

  console.log(name, type, filePath);

  ctx.body = "success";
});
