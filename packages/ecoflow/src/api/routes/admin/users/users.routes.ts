import { EcoRouter } from "../../../../service/EcoRouter";
import fetchUserUsernames from "../../../controllers/user/fetchUserUsernames.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const adminUsersRouter = EcoRouter.createRouter();
export default adminUsersRouter;

adminUsersRouter.get("/usernames", isAuthenticated, fetchUserUsernames);
adminUsersRouter.get(
  "/usernames/:isSystem",
  isAuthenticated,
  fetchUserUsernames
);
