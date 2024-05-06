/**
 * Interface for Token Services that defines methods for managing tokens.
 */
export interface TokenServices {
  /**
   * Retrieves all tokens from the database based on the type of connection.
   * @returns {Promise<Tokens[]>} A promise that resolves to an array of tokens.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  getAllTokens(): Promise<Tokens[]>;

  /**
   * Asynchronously checks if a given token is valid for a specific user.
   * @param {string} token - The token to check for validity.
   * @param {string} userId - The ID of the user associated with the token.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the token is valid.
   */
  checkToken(token: string, userId: string): Promise<boolean>;

  /**
   * Generates access and refresh tokens for a given user ID and sets the refresh token in the database.
   * @param {string} _id - The user ID for which tokens are generated.
   * @returns A promise that resolves to an array containing the access token, refresh token, and refresh token expiration time.
   */
  generateToken(_id: string): Promise<[string, string, number]>;

  /**
   * Removes a token associated with a specific user from the database.
   * @param {string} token - The token to be removed.
   * @param {string} userId - The ID of the user associated with the token.
   * @returns {Promise<void>} A promise that resolves once the token is successfully removed.
   */
  removeToken(token: string, userId: string): Promise<void>;

  /**
   * Migrates a token to the database based on the type of database connection.
   * @param {Tokens} token - The token object to migrate.
   * @returns {Promise<void>} A promise that resolves when the token is successfully migrated.
   * @throws {string} If an invalid database connection is specified.
   */
  migrateToken(token: Tokens): Promise<void>;
}

/**
 * Interface representing a token object.
 * @interface Tokens
 * @property {_id} [string] - The unique identifier of the token.
 * @property {String} userId - The user ID associated with the token.
 * @property {String} token - The token string.
 * @property {number | Date} created_at - The timestamp or date when the token was created.
 * @property {number | Date} updated_at - The timestamp or date when the token was last updated.
 * @property {number | Date} expires_at - The timestamp or date when the token expires.
 */
export interface Tokens {
  _id?: string;
  userId: String;
  token: String;
  created_at: number | Date;
  updated_at: number | Date;
  expires_at: number | Date;
}
