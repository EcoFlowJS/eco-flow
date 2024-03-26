import { ApiResponse, UserInfo } from "@eco-flow/types";
import { Context } from "koa";

const updateUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userID } = ctx.params;
  const { username, name, password, email, roles } = ctx.request.body;
  try {
    if (_.isUndefined(userID)) throw "userID is empty";

    if (_.isEmpty(username)) throw "username is empty";
    if (_.isEmpty(name)) throw "name is empty";

    const { UserService, AuditLogsService } = service;

    const userUpdates: UserInfo = Object.create({});
    if (userID !== username.trim().toLowerCase()) {
      if (await UserService.isUserExist(username)) throw "User already exists";
      userUpdates.username = username;
    }

    userUpdates.name = name;
    userUpdates.email = email;
    userUpdates.roles = roles;

    await UserService.upddateUser(userID, userUpdates);

    if (!_.isUndefined(password) && !_.isEmpty(password))
      await UserService.updatePassword(userID, "", password, true);

    ctx.body = <ApiResponse>{
      success: true,
      payload: "User updated successfully.",
    };

    await AuditLogsService.addLog({
      message: `User(${userID}) updated successfully by ${ctx.user}.`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default updateUser;
