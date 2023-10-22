import koaCors from "@koa/cors";
import { ILoggingConfig } from "../../utils/logger";
import { RouterOptions } from "@koa/router";

export interface configSettings {
  //Base configuration
  userDir?: string;
  moduleDir?: string;

  //Flow configuration
  flowFile?: string;
  flowFilePretty?: boolean;

  //Modules configuration

  //Admin configuration
  adminAuth?: string;

  //HHTP HTTPS configuration
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
  httpAdminRoot?: string;
  httpModuleRoot?: string;
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
  runtimeState?: {
    enabled?: boolean;
    ui?: boolean;
  };

  //Logger configuration
  logging?: ILoggingConfig;

  //API configuration
  api_port?: string | number;
  api_base_url?: string;
}

export namespace configOptions {
  //Base configuration
  export let userDir: string | undefined;
  export let moduleDir: string | undefined;

  //Flow configuration
  export let flowFile: string | undefined;
  export let flowFilePretty: boolean | undefined;

  //Modules configuration

  //Admin configuration
  export let adminAuth: string | undefined;

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
  export let runtimeState:
    | {
        enabled?: boolean;
        ui?: boolean;
      }
    | undefined;

  //Logger configuration
  export let logging: ILoggingConfig | undefined;

  //API configuration
  export let api_port: string | number | undefined;
  export let api_base_url: string | undefined;
}
