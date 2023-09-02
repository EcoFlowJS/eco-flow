import { Application, NextFunction } from "express";
import { LLoggingConfig } from "./logger.interface";

export interface configSettings {
  flowFile?: string;
  credentialSecret?: string;
  flowFilePretty?: boolean;
  userDir?: string;
  nodesDir?: string;
  adminAuth?: {
    type: string;
    users: {
      username: string;
      password: string;
      permissions: string;
    }[];
  };
  https?: {
    key: string;
    cert: string;
  };
  httpsRefreshInterval?: number;
  requireHttps?: boolean;
  httpNodeAuth?: {
    user: string;
    pass: string;
  };
  httpStaticAuth?: {
    user: string;
    pass: string;
  };

  Port?: string | number;
  Host?: string;
  httpServerOptions?: Application;
  httpAdminRoot?: string;
  httpAdminMiddleware?: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
  httpNodeRoot?: string;
  httpNodeCors?: {
    origin: string;
    methods: string[];
  };
  httpNodeMiddleware?: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
  httpStatic?:
    | string
    | {
        path: string;
        root: string;
      }[];
  httpStaticRoot?: string;
  lang?: string;
  diagnostics?: {
    enabled?: boolean;
    ui?: boolean;
  };
  runtimeState?: {
    enabled?: boolean;
    ui?: boolean;
  };
  logging?: LLoggingConfig;

  // TO-DO Editor Settings

  fileWorkingDirectory?: string;
  functionExternalModules?: boolean;
  functionGlobalContext?: {};
  nodeMessageBufferMaxLength?: number;
  debugMaxLength?: number;
  execMaxBufferSize?: number;
  httpRequestTimeout?: number;
  webSocketReconnectTime?: number;
  serialReconnectTime?: number;
  inboundWebSocketTimeout?: number;

  api_port?: string | number;
  api_base_url?: string;
}
