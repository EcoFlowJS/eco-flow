import { homedir } from "os";
import { configOptions } from "@ecoflow/types";
import { LogLevel } from "@ecoflow/utils";
import path from "path";
const baseUserDir =
  process.env.userDir || homedir().replace(/\\/g, "/") + "/.ecoflow";

const defaultConfig: configOptions = {
  /*******************************************************************************
   * User Directory Settings
   *  - userDir
   *  - moduleDir
   *  - envDir
   *  - DB_DriverDir
   ******************************************************************************/
  userDir: baseUserDir, // Base directory where all  directiory files are stored.
  moduleDir: baseUserDir + "/modules", // Directory where all modules are installed and stored.
  envDir: baseUserDir + "/environment", // Directory where all environment variables are stored.
  DB_Directory: path.join(baseUserDir, "Database").replace(/\\/g, "/"), // Directory where all Database Connection files are stored.

  /*******************************************************************************
   * Flow File Settings
   *  - flowFile
   *  - flowFilePretty
   ******************************************************************************/
  flowFile: "flows.json", // JSON file containing flow configuration settings.
  flowFilePretty: true, // Set where JSON flow configuration settings should be formatted or not.
  /*******************************************************************************
   * Server Settings
   *  - Host
   *  - Port
   *  - https
   *  - httpCors
   ******************************************************************************/
  Host: "127.0.0.1", // Server Host to where the server should be served at. Default is 0.0.0.0.
  Port: process.env.PORT || 4000, //Port number at which the server to be served at. Default id 4000.
  https: {
    //HTTPS Configuration of the server
    enabled: false,
    key: "",
    cert: "",
  },
  httpCors: {
    // CORS Configurations
    enabled: true,
    origin: "*", //`Access-Control-Allow-Origin`, default is request Origin header.
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"], //`Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
    exposeHeaders: [], //`Access-Control-Expose-Headers`
    allowHeaders: [], // Access-Control-Allow-Headers`
    maxAge: 0, //`Access-Control-Max-Age` in seconds
    credentials: true, //`Access-Control-Allow-Credentials`
    keepHeadersOnError: false, //Add set headers to `err.header` if an error is thrown
    secureContext: false, //Add `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` to response headers
    privateNetworkAccess: false, //Handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`
  },

  /*******************************************************************************
   * Router Settings
   *  - systemRouterOptions
   *  - apiRouterOptions
   *  - httpStatic
   *  - httpStaticRoot
   ******************************************************************************/
  systemRouterOptions: {
    prefix: "/systemApi", //Prefix for all routes
    methods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"], //Methods which should be supported by the router.
    routerPath: "", //Path to the router which should be used for all routes
    sensitive: false, //Whether or not routing should be case-sensitive.
    strict: true, // Whether or not routes should matched strictly. [If strict matching is enabled, the trailing slash is taken into account when matching routes.]
    exclusive: false, // Only run last matched route's controller when there are multiple matches
    host: "", //Host for router match
  },

  apiRouterOptions: {
    prefix: "/api", //Prefix for all routes. Default is /api
    methods: ["GET", "PUT", "POST", "DELETE"], //Methods which should be supported by the router.
    routerPath: "", //Path to the router which should be used for all routes
    sensitive: false, //Whether or not routing should be case-sensitive.
    strict: true, // Whether or not routes should matched strictly. [If strict matching is enabled, the trailing slash is taken into account when matching routes.]
    exclusive: false, // Only run last matched route's controller when there are multiple matches
    host: "", //Host for router match
  },

  httpStatic: "/public", // Static content path for all requests.
  httpStaticRoot: "", //Root path for static contents.

  /*******************************************************************************
   * Application Settings
   *  - lang
   *  - diagnostics
   ******************************************************************************/
  lang: "en-US",
  diagnostics: {
    /** enable or disable diagnostics endpoint. Must be set to `false` to disable */
    enabled: true,
    /** enable or disable diagnostics display in the editor. Must be set to `false` to disable */
    ui: true,
  },

  /*******************************************************************************
   * Logger Settings
   *  - Logger
   ******************************************************************************/
  logging: {
    enabled: true, //Enable or Disable logging output.
    level: LogLevel.INFO, //Logging level.
    format: "`[ ${timestamp} ] : [ ${label} ] | [ ${level} ] : ${message}`",
    prettyPrint: false, //Pretty print the logging output.
    lable: {
      //Global logging lable
      enable: true, //Enable logging lable
      lable: "Eco-FLow", //Logging lable text
    },
    console: true, //Logging Console Enable or Disable
    file: {
      //Logging File
      enabled: false, //Logging File Enable or Disable
      location: "", //Logging File Location
      filename: "", //Logging File Filename
    },
    web: {
      //Logging Web
      enabled: false, //Enable or Disable web logging
      host: "", //Logging Host
      port: 0, //Logging Port
      path: "/", //Logging path
    },
  },

  /*******************************************************************************
   * Editor Settings
   *  - api_base_url
   ******************************************************************************/
  editor: {
    //Editor Settings
    enabled: true, //Enable or Disable editor.
    admin: true, //Enable or Disable admin editor.
    flow: true, //Enable or Disable flow editor.
    schema: true, //Enable or Disable schema editor.
  },

  database: {
    driver: "SQLite",
    configuration: {
      filename: path
        .join(baseUserDir, "Database", "DB_connections", "ecoflowDB.sqlite")
        .replace(/\\/g, "/"),
    },
  },
};

export default defaultConfig;
