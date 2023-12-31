import jwt, { SignOptions } from "jsonwebtoken";

export default (
  value: string | object | Buffer,
  options?: SignOptions
): string => jwt.sign(value, process.env.ECOFLOW_SYS_TOKEN_SALT!, options);
