export interface ILoggingConfig {
  enabled: boolean;
  level: number;
  format?: string;
  prettyPrint?: boolean;
  lable?: {
    enable: boolean;
    lable?: string;
  };
  console?: boolean;
  file?: {
    enabled: boolean;
    location?: string;
    filename?: string;
  };
  web?: {
    enabled: boolean;
    host?: string;
    port?: number;
    path?: string;
  };
}

export interface ILoggingDefaultConfig {
  enabled: boolean;
  level: number;
  format: string;
  prettyPrint: boolean;
  lable: {
    enable: boolean;
    lable: string;
  };
  console: boolean;
  file: {
    enabled: boolean;
    location: string;
    filename: string;
  };
  web: {
    enabled: boolean;
    host: string;
    port: number;
    path: string;
  };
}

export enum LogLevel {
  ERROR = 0,
  WARNING = 1,
  INFO = 2,
  VERBOSE = 4,
  DEBUG = 5,
}
