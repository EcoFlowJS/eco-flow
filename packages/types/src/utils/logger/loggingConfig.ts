export type ILoggingConfig = {
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
};
