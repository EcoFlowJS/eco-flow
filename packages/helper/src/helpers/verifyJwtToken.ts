import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";

/**
 * Verify a JWT token using the provided options.
 * @param {string} token - The JWT token to verify.
 * @param {VerifyOptions} [options] - Optional verification options.
 * @returns {JwtPayload | string | null} - The decoded payload if verification is successful,
 * a string if verification fails, or null if an error occurs.
 */
const verifyJwtToken = (
  token: string,
  options?: VerifyOptions
): JwtPayload | string | null => {
  try {
    return jwt.verify(token, process.env.ECOFLOW_SYS_TOKEN_SALT!, options);
  } catch (err) {
    return null;
  }
};

export default verifyJwtToken;
