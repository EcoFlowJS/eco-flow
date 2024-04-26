import Helper from "@ecoflow/helper";
import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const createUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { username, name, password, email, roles } = ctx.request.body;

  if (_.isUndefined(username)) throw "username is required";
  if (_.isUndefined(name)) throw "name is required";
  if (_.isUndefined(password)) throw "password is required";

  try {
    const { UserService, AuditLogsService } = service;
    if (await UserService.isUserExist(username)) throw "User already exists.";

    if (!Helper.validatePasswordRegex(password))
      throw "Password must have at least a symbol, upper and lower case letters and a number.";

    await UserService.createUser({
      username,
      name,
      password,
      email,
      roles,
    });

    ctx.body = <ApiResponse>{
      success: true,
      payload: "User Created successful.",
    };

    await AuditLogsService.addLog({
      message: `New user ${username} created by ${ctx.user}.`,
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

export default createUser;
