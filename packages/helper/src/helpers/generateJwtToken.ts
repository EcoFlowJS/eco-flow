import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Generates a JWT token with the given value and options.
 * @param {string | object | Buffer} value - The value to be encoded in the token.
 * @param {SignOptions} [options] - The options for signing the token.
 * @returns {string} The generated JWT token.
 */
const generateJwtToken = (
  value: string | object | Buffer,
  options?: SignOptions
): string => jwt.sign(value, process.env.ECOFLOW_SYS_TOKEN_SALT!, options);

export default generateJwtToken;
