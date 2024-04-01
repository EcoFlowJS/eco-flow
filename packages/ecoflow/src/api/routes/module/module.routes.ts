import { EcoRouter } from "../../../service/EcoRouter";
import fetchModule from "../../controllers/module/fetchModule.controller";

const moduleRouter = EcoRouter.createRouter();
export default moduleRouter;

moduleRouter.get("/", fetchModule);
moduleRouter.get("/:moduleID", fetchModule);
