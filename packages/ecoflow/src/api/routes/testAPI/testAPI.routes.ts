import { EcoRouter } from "../../../service/EcoRouter.js";
import testAPIController from "../../controllers/testAPI/testAPIController.controller.js";

const testAPIRouter = EcoRouter.createRouter();
export default testAPIRouter;

testAPIRouter.get("/", testAPIController);
