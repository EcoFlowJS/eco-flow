import { EcoRouter } from "../../../../service/EcoRouter";
import databaseValidatorBlank from "../../../controllers/setup/blank/databaseValidatorBlank.controller";
import processSetupBlank from "../../../controllers/setup/blank/processSetupBlank.controller";

const setupBlankRouter = EcoRouter.createRouter();
export default setupBlankRouter;

/**
 * Sets up a POST route at '/validateDB' for validating the database using the 'databaseValidatorBlank' function.
 * @param {string} "/validateDB" - The route path for validating the database.
 * @param {Function} databaseValidatorBlank - The function used for validating the database.
 * @returns None
 */
setupBlankRouter.post("/validateDB", databaseValidatorBlank);

/**
 * Sets up a POST route for handling requests to the root URL ("/") using the setupBlank function.
 * @param {string} "/" - The route path
 * @param {function} processSetupBlank - The function to process requests to the specified route
 * @returns None
 */
setupBlankRouter.post("/", processSetupBlank);
