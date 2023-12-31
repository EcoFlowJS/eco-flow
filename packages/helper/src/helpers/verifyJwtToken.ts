import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";

export default (
  token: string,
  options?: VerifyOptions
): JwtPayload | string | null => {
  try {
    return jwt.verify(token, process.env.ECOFLOW_SYS_TOKEN_SALT!, options);
  } catch (err) {
    return null;
  }
};
