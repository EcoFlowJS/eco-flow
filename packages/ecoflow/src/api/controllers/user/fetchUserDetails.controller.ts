import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const fetchUserDetails = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userID } = ctx.params;

  try {
    if (_.isUndefined(userID)) throw "Please enter a username";

    const { username, name, email, roles, isActive } =
      (await service.UserService.getUserInfos(userID, true)).user || {};

    ctx.body = <ApiResponse>{
      success: true,
      payload: { username, name, email, roles, isActive },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserDetails;
