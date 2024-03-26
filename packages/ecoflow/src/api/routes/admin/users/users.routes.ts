import { EcoRouter } from "../../../../service/EcoRouter";
import createUser from "../../../controllers/user/createUser.controller";
import fetchUserDetails from "../../../controllers/user/fetchUserDetails.controller";
import fetchUserUsernames from "../../../controllers/user/fetchUserUsernames.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";
import toggleUser from "../../../controllers/user/toggleUser.controller";
import updateUser from "../../../controllers/user/updateUser.controller";

const adminUsersRouter = EcoRouter.createRouter();
export default adminUsersRouter;

adminUsersRouter.get("/usernames", isAuthenticated, fetchUserUsernames);
adminUsersRouter.get(
  "/usernames/:isSystem",
  isAuthenticated,
  fetchUserUsernames
);

adminUsersRouter.get("/:userID", isAuthenticated, fetchUserDetails);
adminUsersRouter.post("/", isAuthenticated, createUser);
adminUsersRouter.patch("/:userID", isAuthenticated, updateUser);
adminUsersRouter.patch("/:userID/ToggleUser", isAuthenticated, toggleUser);
