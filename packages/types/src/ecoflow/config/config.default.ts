import koaCors from "@koa/cors";
import { loggerOptions } from "../../utils/logger/index.js";
import { RouterOptions } from "@koa/router";
import { ConnectionConfig, DB_Drivers } from "../../database/index.js";

/**
 * Extends the koaCors.Options interface to include an additional property 'enabled' of type boolean.
 */
interface httpCors extends koaCors.Options {
  enabled: boolean;
}

/**
 * Interface for configuration options for a system.
 * @interface configOptions
 */
export interface configOptions {
  /**
   * Optional property that specifies the directory of the user.
   * @type {string}
   */
  userDir?: string;

  /**
   * The directory path for the module. Optional parameter.
   */
  moduleDir?: string;

  /**
   * Optional parameter that specifies the direction of the flow.
   * @type {string}
   */
  flowDir?: string;

  /**
   * The directory where environment variables are stored.
   * @type {string | undefined}
   */
  envDir?: string;

  /**
   * Optional property representing the directory of the database.
   * @type {string | undefined}
   */
  DB_Directory?: string;

  /**
   * Optional configuration for Flow nodes.
   * @type {string}
   */
  flowNodeConfigurations?: string;

  /**
   * Optional property that defines the flow node definitions.
   */
  flowNodeDefinitions?: string;

  /**
   * Optional property that represents the connections of a flow node.
   * @type {string | undefined}
   */
  flowNodeConnections?: string;

  /**
   * Optional parameter to specify if the flow file should be formatted prettily.
   * @type {boolean}
   */
  flowFilePretty?: boolean;

  /**
   * Optional property representing the host string.
   */
  Host?: string;

  /**
   * The port number for a network connection, can be either a string or a number.
   */
  Port?: string | number;

  /**
   * Configuration options for HTTPS settings.
   * @property {boolean} enabled - Indicates if HTTPS is enabled or not.
   * @property {string} [key] - The path to the private key file for HTTPS.
   * @property {string} [cert] - The path to the certificate file for HTTPS.
   */
  https?: {
    enabled: boolean;
    key?: string;
    cert?: string;
  };

  /**
   * An optional parameter that specifies the CORS configuration for HTTP requests.
   * @type {httpCors}
   */
  httpCors?: httpCors;

  /**
   * Optional configuration options for the API router.
   */
  apiRouterOptions?: RouterOptions;

  /**
   * Represents the static file or directory to serve over HTTP.
   * It can be a string representing a single file path or an array of objects
   * with 'path' and 'root' properties representing multiple file paths and their root directories.
   * @type {string | {path: string, root: string}[]}
   */
  httpStatic?:
    | string
    | {
        path: string;
        root: string;
      }[];

  /**
   * Optional property that specifies the root directory for serving static files over HTTP.
   * @type {string | undefined}
   */
  httpStaticRoot?: string;

  /**
   * Optional parameter that specifies the language of the Application.
   * @type {string}
   */
  lang?: string;

  /**
   * Optional diagnostics settings object.
   * @property {boolean} [enabled] - Whether diagnostics are enabled.
   * @property {boolean} [ui] - Whether UI diagnostics are enabled.
   */
  diagnostics?: {
    enabled?: boolean;
    ui?: boolean;
  };

  /**
   * An optional parameter for specifying logger options.
   * @type {loggerOptions}
   */
  logging?: loggerOptions;

  /**
   * Configuration options for the editor.
   * @property {boolean} enabled - Indicates if the editor is enabled.
   * @property {boolean} [admin] - Indicates if the user has admin privileges.
   * @property {boolean} [flow] - Indicates if flow is enabled.
   * @property {boolean} [schema] - Indicates if schema is enabled.
   */
  editor?: {
    enabled: boolean;
    admin?: boolean;
    flow?: boolean;
    schema?: boolean;
  };

  /**
   * Optional database configuration object.
   * @property {DB_Drivers} driver - The driver to use for the database connection.
   * @property {ConnectionConfig} configuration - The configuration settings for the database connection.
   */
  database?: {
    driver: DB_Drivers;
    configuration: ConnectionConfig;
  };
}

/**
 * Namespace containing various configuration options for the application.
 * @namespace configOptions
 */
export namespace configOptions {
  /**
   * A variable that stores the direction of the user interface, if defined.
   * @type {string | undefined}
   */
  export let userDir: string | undefined;

  /**
   * The directory path of the module, if defined.
   */
  export let moduleDir: string | undefined;

  /**
   * A variable that represents the direction of the flow.
   * @type {string | undefined}
   */
  export let flowDir: string | undefined;

  /**
   * The directory path for the environment.
   */
  export let envDir: string | undefined;

  /**
   * A variable that holds the directory path for the database.
   * It can be either a string representing the directory path or undefined if not set.
   */
  export let DB_Directory: string | undefined;

  /**
   * Configuration settings for flow nodes.
   */
  export let flowNodeConfigurations: string | undefined;

  /**
   * A string containing flow node definitions, or undefined if not set.
   */
  export let flowNodeDefinitions: string | undefined;

  /**
   * A variable that represents the connections between flow nodes.
   * It can be a string representing the connections or undefined if there are no connections.
   */
  export let flowNodeConnections: string | undefined;

  /**
   * A boolean flag indicating whether the flow file should be prettified or not.
   */
  export let flowFilePretty: boolean | undefined;

  /**
   * A variable that represents the host string or undefined if not set.
   */
  export let Host: string | undefined;

  /**
   * A variable that can hold a value of type string, number, or undefined.
   */
  export let Port: string | number | undefined;

  /**
   * Configuration object for enabling HTTPS with optional key and certificate.
   * @type {{
   *  enabled: boolean;
   *  key?: string;
   *  cert?: string;
   * }} | undefined
   */
  export let https:
    | {
        enabled: boolean;
        key?: string;
        cert?: string;
      }
    | undefined;

  /**
   * Variable to store the httpCors configuration for handling Cross-Origin Resource Sharing (CORS).
   * @type {httpCors | undefined}
   */
  export let httpCors: httpCors | undefined;

  /**
   * Options for the API router.
   */
  export let apiRouterOptions: RouterOptions | undefined;

  /**
   * The root URL for the HTTP admin interface.
   */
  export let httpAdminRoot: string | undefined;

  /**
   * A variable that can be either a string, an array of objects with 'path' and 'root' properties,
   * or undefined. It is used to define the static file server configuration for serving static files over HTTP.
   */
  export let httpStatic:
    | string
    | {
        path: string;
        root: string;
      }[]
    | undefined;

  /**
   * The root URL for static assets served over HTTP.
   * @type {string | undefined}
   */
  export let httpStaticRoot: string | undefined;

  /**
   * A variable that holds a string representing the language, or undefined if no language is specified.
   */
  export let lang: string | undefined;

  /**
   * A variable that holds diagnostic settings.
   * @type {{
   *   enabled?: boolean;
   *   ui?: boolean;
   * }} | undefined
   */
  export let diagnostics:
    | {
        enabled?: boolean;
        ui?: boolean;
      }
    | undefined;

  /**
   * A variable that holds the options for logging.
   * @type {loggerOptions | undefined}
   */
  export let logging: loggerOptions | undefined;

  /**
   * A variable that represents the editor settings.
   * @type {{
   *  enabled: boolean;
   *  admin?: boolean;
   *  flow?: boolean;
   *  schema?: boolean;
   * }} | undefined
   */
  export let editor:
    | {
        enabled: boolean;
        admin?: boolean;
        flow?: boolean;
        schema?: boolean;
      }
    | undefined;

  /**
   * Represents a database configuration object that includes the driver and connection configuration.
   * @type {{
   *   driver: DB_Drivers;
   *   configuration: ConnectionConfig;
   * } | undefined}
   */
  export let database:
    | {
        driver: DB_Drivers;
        configuration: ConnectionConfig;
      }
    | undefined;
}
