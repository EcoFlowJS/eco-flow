import { EcoRouter } from "../../../service/EcoRouter";
import testAPIController from "../../controllers/testAPI/testAPIController.controller";

const testAPIRouter = EcoRouter.createRouter();
export default testAPIRouter;

testAPIRouter.get("/", testAPIController);
