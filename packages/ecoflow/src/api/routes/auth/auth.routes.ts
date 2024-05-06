import { EcoRouter } from "../../../service/EcoRouter";
import userRouter from "./users/authUser.routes";

const authRouter = EcoRouter.createRouter();
export default authRouter;

/**
 * Defines a route for handling GET requests to the root path of the authentication router.
 * Sets the response body to "Auth Router".
 * @param {Object} ctx - The context object representing the request and response.
 * @returns None
 */
authRouter.get("/", (ctx) => (ctx.body = "Auth Router"));

/**
 * Mounts the userRouter routes under the "/users" path in the authRouter.
 * @param {string} "/users" - The base path for the user routes.
 * @param {Router} userRouter - The router containing user-related routes.
 * @returns None
 */
authRouter.use("/users", userRouter.routes());
