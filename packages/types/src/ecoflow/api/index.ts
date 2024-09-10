export * from "./setup/index.js";
/**
 * Interface for the API response object.
 * @interface ApiResponse
 * @property {boolean} [error] - Indicates if there was an error in the response.
 * @property {boolean} [success] - Indicates if the response was successful.
 * @property {any} [payload] - The payload data of the response.
 */
export interface ApiResponse {
  /**
   * Optional boolean flag indicating the presence of an error.
   * @type {boolean}
   */
  error?: boolean;

  /**
   * Optional boolean flag indicating the success status.
   */
  success?: boolean;

  /**
   * An optional payload of any type.
   */
  payload?: any;
}
