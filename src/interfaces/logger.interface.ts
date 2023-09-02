export interface LLoggingConfig {
  console?: {
    enabled: boolean;
    level: string;
    toFile?: boolean;
    format?: (level: any, date: any, message: any) => string;
  };
  web?: {
    enabled: boolean;
    level: string;
    format?: (level: any, date: any, message: any) => string;
  };
}
