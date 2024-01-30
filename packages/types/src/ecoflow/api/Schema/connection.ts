export interface ConnectionDefinations {
  ConnectionName: string;
  dbDriver: string;
  mongoConnectionString: string;
  SqliteFileName: string;
  SqliteFileLoc: string;
  Host: string;
  Port: number;
  Username: string;
  Password: string;
  isSSL: boolean;
  Database: string;
}

export interface ConnectionResponse {
  error?: boolean;
  success?: boolean;
  payload?: any;
}
