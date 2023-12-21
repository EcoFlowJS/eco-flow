import koaCors from "@koa/cors";
import { loggerOptions } from "../../utils/logger";
import { RouterOptions } from "@koa/router";

export interface configOptions {
  //Base configuration
  userDir?: string;
  moduleDir?: string;
  envDir?: string;
  DB_DriverDir?: string;
  DB_ConnectionsDir?: string;

  //Flow configuration
  flowFile?: string;
  flowFilePretty?: boolean;

  //HTTP HTTPS configuration
  Host?: string;
  Port?: string | number;
  https?: {
    enabled: boolean;
    key?: string;
    cert?: string;
  };
  httpCors?: koaCors.Options;

  //Router configuration
  systemRouterOptions?: RouterOptions;
  apiRouterOptions?: RouterOptions;
  httpStatic?:
    | string
    | {
        path: string;
        root: string;
      }[];
  httpStaticRoot?: string;

  //Application configuration
  lang?: string;
  diagnostics?: {
    enabled?: boolean;
    ui?: boolean;
  };

  //Logger configuration
  logging?: loggerOptions;

  //Editors configuration
  editor?: {
    enabled: boolean;
    admin?: boolean;
    flow?: boolean;
    schema?: boolean;
  };
}

export namespace configOptions {
  //Base configuration
  export let userDir: string | undefined;
  export let moduleDir: string | undefined;
  export let envDir: string | undefined;
  export let DB_DriverDir: string | undefined;
  export let DB_ConnectionsDir: string | undefined;

  //Flow configuration
  export let flowFile: string | undefined;
  export let flowFilePretty: boolean | undefined;

  //HHTP HTTPS configuration
  export let Host: string | undefined;
  export let Port: string | number | undefined;
  export let https:
    | {
        enabled: boolean;
        key?: string;
        cert?: string;
      }
    | undefined;
  export let httpCors: koaCors.Options | undefined;

  //Router configuration
  export let systemRouterOptions: RouterOptions | undefined;
  export let apiRouterOptions: RouterOptions | undefined;
  export let httpAdminRoot: string | undefined;
  export let httpStatic:
    | string
    | {
        path: string;
        root: string;
      }[]
    | undefined;
  export let httpStaticRoot: string | undefined;

  //Application configuration
  export let lang: string | undefined;
  export let diagnostics:
    | {
        enabled?: boolean;
        ui?: boolean;
      }
    | undefined;

  //Logger configuration
  export let logging: loggerOptions | undefined;

  //Editor configuration
  export let editor:
    | {
        enabled: boolean;
        admin?: boolean;
        flow?: boolean;
        schema?: boolean;
      }
    | undefined;
}
