import { homedir } from "os";
import { configSettings } from "@eco-flow/types";
import { LogLevel } from "@eco-flow/utils";
import path from "path";
const baseUserDir =
  process.env.userDir || homedir().replace(/\\/g, "/") + "/.ecoflow";

const defaultConfig: configSettings = {
  /*******************************************************************************
   * Flow File and User Directory Settings
   *  - flowFile
   *  - credentialSecret
   *  - flowFilePretty
   *  - userDir
   *  - nodesDir
   ******************************************************************************/
  flowFile: "flows.json",
  //credentialSecret: "a-secret-key",
  flowFilePretty: true,
  userDir: baseUserDir,
  moduleDir: baseUserDir + "/nodes",
  envDir: baseUserDir + "/environment",
  DB_DriverDir: path.join(baseUserDir, "DB_Driver"),
  /*******************************************************************************
   * Security
   *  - adminAuth
   *  - https
   *  - httpsRefreshInterval
   *  - requireHttps
   *  - httpNodeAuth
   *  - httpStaticAuth
   ******************************************************************************/
  // adminAuth: {
  //   type: "credentials",
  //   users: [
  //     {
  //       username: "admin",
  //       password:
  //         "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.",
  //       permissions: "*",
  //     },
  //   ],
  // },
  /** Option 1: static object */
  // https: {
  //  key: require("fs").readFileSync('privkey.pem'),
  //  cert: require("fs").readFileSync('cert.pem')
  // },
  /** Option 2: function that returns the HTTP configuration object */
  // https: function() {
  //     // This function should return the options object, or a Promise
  //     // that resolves to the options object
  //     return {
  //         key: require("fs").readFileSync('privkey.pem'),
  //         cert: require("fs").readFileSync('cert.pem')
  //     }
  // },
  // httpsRefreshInterval : 12,
  // requireHttps: true,
  // httpNodeAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
  // httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
  /*******************************************************************************
   * Server Settings
   *  - Port
   *  - Host
   *  - httpServerOptions
   *  - httpAdminRoot
   *  - httpAdminMiddleware
   *  - httpNodeRoot
   *  - httpNodeCors
   *  - httpNodeMiddleware
   *  - httpStatic
   *  - httpStaticRoot
   ******************************************************************************/
  Port: process.env.PORT || 4000,
  Host: "0.0.0.0",
  /** The following property can be used to pass custom options to the Express.js
   * server used by Node-RED. For a full list of available options, refer
   * to http://expressjs.com/en/api.html#app.settings.table
   */
  // httpServerOptions: { },
  /** The following property can be used to add a custom middleware function
   * in front of all admin http routes. For example, to set custom http
   * headers. It can be a single function or an array of middleware functions.
   */
  // httpAdminMiddleware: function(req,res,next) {
  //    // Set the X-Frame-Options header to limit where the editor
  //    // can be embedded
  //    //res.set('X-Frame-Options', 'sameorigin');
  //    next();
  // },
  /** Some nodes, such as HTTP In, can be used to listen for incoming http requests.
   * By default, these are served relative to '/'. The following property
   * can be used to specify a different root path. If set to false, this is
   * disabled.
   */
  // httpNodeRoot: '/get-http',
  /** The following property can be used to configure cross-origin resource sharing
   * in the HTTP nodes.
   * See https://github.com/troygoode/node-cors#configuration-options for
   * details on its contents. The following is a basic permissive set of options:
   */
  httpCors: {
    origin: "*",
    allowMethods: ["GET", "PUT", "POST", "DELETE"],
  },
  /** The following property can be used to add a custom middleware function
   * in front of all http in nodes. This allows custom authentication to be
   * applied to all http in nodes, or any other sort of common request processing.
   * It can be a single function or an array of middleware functions.
   */
  // httpNodeMiddleware: function (req, res, next) {
  //   // Handle/reject the request, or pass it on to the http in node by calling next();
  //   // Optionally skip our rawBodyParser by setting this to true;
  //   //req.skipRawBodyParser = true;
  //   next();
  // },
  /** When httpAdminRoot is used to move the UI to a different root path, the
   * following property can be used to identify a directory of static content
   * that should be served at http://localhost:1880/.
   * When httpStaticRoot is set differently to httpAdminRoot, there is no need
   * to move httpAdminRoot
   */
  // httpStatic: '/home/ef/node-red-static/', //single static source
  /* OR multiple static sources can be created using an array of objects... */
  // httpStatic: [
  //    {path: '/home/ef/pics/',    root: "/img/"},
  //    {path: '/home/ef/reports/', root: "/doc/"},
  // ],
  /**
   * All static routes will be appended to httpStaticRoot
   * e.g. if httpStatic = "/home/ef/docs" and  httpStaticRoot = "/static/"
   *      then "/home/ef/docs" will be served at "/static/"
   * e.g. if httpStatic = [{path: '/home/ef/pics/', root: "/img/"}]
   *      and httpStaticRoot = "/static/"
   *      then "/home/ef/pics/" will be served at "/static/img/"
   */
  // httpStaticRoot: '/static/',
  /*******************************************************************************
   * Core Settings
   *  - lang
   *  - diagnostics
   *  - runtimeState
   *  - logging
   *  - externalModules
   ******************************************************************************/
  /** Uncomment the following to run in your preferred language.
   * Available languages include: en-US (default)
   * Some languages are more complete than others.
   */
  lang: "en-US",
  /** Configure diagnostics options
   * - enabled:  When `enabled` is `true` (or unset), diagnostics data will
   *   be available at http://localhost:1880/diagnostics
   * - ui: When `ui` is `true` (or unset), the action `show-system-info` will
   *   be available to logged in users of editor
   */
  diagnostics: {
    /** enable or disable diagnostics endpoint. Must be set to `false` to disable */
    enabled: true,
    /** enable or disable diagnostics display in the editor. Must be set to `false` to disable */
    ui: true,
  },
  /** Configure runtimeState options
   * - enabled:  When `enabled` is `true` flows runtime can be Started/Stopped
   *   by POSTing to available at http://localhost:1880/flows/state
   * - ui: When `ui` is `true`, the action `core:start-flows` and
   *   `core:stop-flows` will be available to logged in users of editor
   *   Also, the deploy menu (when set to default) will show a stop or start button
   */
  runtimeState: {
    /** enable or disable flows/state endpoint. Must be set to `false` to disable */
    enabled: false,
    /** show or hide runtime stop/start options in the editor. Must be set to `false` to hide */
    ui: false,
  },
  /** Configure the logging output */
  logging: {
    enabled: true,
    level: LogLevel.INFO,
    format: "`[ ${timestamp} ] : [ ${label} ] | [ ${level} ] : ${message}`",
    console: true,
  },
  /** Configure how the runtime will handle external npm modules.
   * This covers:
   *  - whether the editor will allow new node modules to be installed
   *  - whether nodes, such as the Function node are allowed to have their
   * own dynamically configured dependencies.
   * The allow/denyList options can be used to limit what modules the runtime
   * will install/load. It can use '*' as a wildcard that matches anything.
   */
  // externalModules: {
  // autoInstall: false,   /** Whether the runtime will attempt to automatically install missing modules */
  // autoInstallRetry: 30, /** Interval, in seconds, between reinstall attempts */
  // palette: {              /** Configuration for the Palette Manager */
  //     allowInstall: true, /** Enable the Palette Manager in the editor */
  //     allowUpdate: true,  /** Allow modules to be updated in the Palette Manager */
  //     allowUpload: true,  /** Allow module tgz files to be uploaded and installed */
  //     allowList: ['*'],
  //     denyList: [],
  //     allowUpdateList: ['*'],
  //     denyUpdateList: []
  // },
  // modules: {              /** Configuration for node-specified modules */
  //     allowInstall: true,
  //     allowList: [],
  //     denyList: []
  // }
  // },
  /*******************************************************************************
   * Editor Settings
   *  - disableEditor
   *  - editorTheme
   ******************************************************************************/
  /** The following property can be used to disable the editor. The admin API
   * is not affected by this option. To disable both the editor and the admin
   * API, use either the httpRoot or httpAdminRoot properties
   */
  //disableEditor: false,
  /** Customising the editor
   * See https://nodered.org/docs/user-guide/runtime/configuration#editor-themes
   * for all available options.
   */
  // editorTheme: {
  //   /** The following property can be used to set a custom theme for the editor.
  //    * a collection of themes to chose from.
  //    */
  //   //theme: "",
  //   /** To disable the 'Welcome to message' tour that is displayed the first
  //    * time you access the editor for each release, set this to false
  //    */
  //   //tours: false,
  //   projects: {
  //     /** To enable the Projects feature, set this value to true */
  //     enabled: false,
  //     workflow: {
  //       /** Set the default projects workflow mode.
  //        *  - manual - you must manually commit changes
  //        *  - auto - changes are automatically committed
  //        * This can be overridden per-user from the 'Git config'
  //        * section of 'User Settings' within the editor
  //        */
  //       mode: "manual",
  //     },
  //   },
  //   codeEditor: {
  //     /** Select the text editor component used by the editor.
  //      * As of V3, this defaults to "monaco", but can be set to "ace" if desired
  //      */
  //     lib: "monaco",
  //     options: {
  //       /** The follow options only apply if the editor is set to "monaco"
  //        *
  //        * theme - must match the file name of a theme in
  //        * packages/node_modules/@node-red/editor-client/src/vendor/monaco/dist/theme
  //        * e.g. "tomorrow-night", "upstream-sunburst", "github", "my-theme"
  //        */
  //       // theme: "vs",
  //       /** other overrides can be set e.g. fontSize, fontFamily, fontLigatures etc.
  //        * for the full list, see https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html
  //        */
  //       //fontSize: 14,
  //       //fontFamily: "Cascadia Code, Fira Code, Consolas, 'Courier New', monospace",
  //       //fontLigatures: true,
  //     },
  //   },
  // },
  /*******************************************************************************
   * Node Settings
   *  - fileWorkingDirectory
   *  - functionExternalModules
   *  - functionGlobalContext
   *  - nodeMessageBufferMaxLength
   *  - debugMaxLength
   *  - execMaxBufferSize
   *  - httpRequestTimeout
   *  - inboundWebSocketTimeout
   *  - webSocketNodeVerifyClient
   ******************************************************************************/
  /** The working directory to handle relative file paths from within the File nodes
   * defaults to the working directory of the process.
   */
  // fileWorkingDirectory: process.cwd().replace(/\\/g, "/"),
  /** Allow the Function node to load additional npm modules directly */
  // functionExternalModules: true,
  /** The following property can be used to set predefined values in Global Context.
   * This allows extra node modules to be made available with in Function node.
   * For example, the following:
   *    functionGlobalContext: { os:require('os') }
   * will allow the `os` module to be accessed in a Function node using:
   *    global.get("os")
   */
  // functionGlobalContext: {
  // os:require('os'),
  // },
  /** The maximum number of messages nodes will buffer internally as part of their
   * operation. This applies across a range of nodes that operate on message sequences.
   * defaults to no limit. A value of 0 also means no limit is applied.
   */
  /*******************************************************************************
   * API Settings
   *  - api_port
   *  - api_base_url
   ******************************************************************************/
  api_port: process.env.apiPort || 4000,
  api_base_url: "api",

  //Editor Configuration
  editor: {
    enabled: true,
  },
};

export default defaultConfig;
