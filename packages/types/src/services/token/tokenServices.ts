export interface TokenServices {
  checkToken(token: string, userId: string): Promise<boolean>;
  setToken(token: string, userId: string, expireIn: Date): Promise<void>;
  updateToken(token: string, userId: string, expireIn: Date): Promise<void>;
}
