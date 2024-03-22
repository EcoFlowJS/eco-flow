import Helper from "@eco-flow/helper";
import { Builder } from "@eco-flow/utils";
import { Context } from "koa";
import jwt from "jsonwebtoken";
import envLoadHelper from "../../../helper/env.helper";

const initStatus = async (ctx: Context) => {
  const isAuth = ecoFlow.isAuth;
  const isNoUser = await ecoFlow.service.UserService.isNoUser();
  let getAccessToken: string | undefined = undefined;
  let user: string | undefined = undefined;

  if (!isAuth) {
    getAccessToken = process.env.ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN!;
    const Token: any = Helper.verifyJwtToken(getAccessToken);
    if (Token === null) {
      getAccessToken = jwt.sign(
        { _id: "admin", accessRoot: true },
        process.env.ECOFLOW_SYS_TOKEN_SALT!,
        { expiresIn: "9999Y" }
      );
      Builder.ENV.setSystemEnv(ecoFlow.config._config.envDir!, [
        {
          name: "NOAUTH_ACCESS_TOKEN",
          value: getAccessToken,
        },
      ]);

      user = "Administrator";
      envLoadHelper();
    } else {
      user = Token._id === "admin" ? "Administrator" : Token._id;
    }
  }

  ctx.body = {
    isAuth: isAuth,
    isNewClient: isNoUser,
    getAccessToken: getAccessToken,
    userID: user,
  };
};

export default initStatus;
