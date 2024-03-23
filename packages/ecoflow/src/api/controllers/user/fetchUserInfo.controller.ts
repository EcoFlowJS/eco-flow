import { ApiResponse, userTableCollection } from "@eco-flow/types";
import { Context } from "koa";

const fetchUserInfo = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  try {
    const { UserService } = service;
    const user = <userTableCollection>(
      (await UserService.getUserAllInfo(ctx.user)).user
    );

    ctx.body = <ApiResponse>{
      success: true,
      payload: {
        name: user.name,
        username: user.username,
        email: user.email,
        isPermanent: user.isPermanent,
        createdAt: user.created_at,
      },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserInfo;
