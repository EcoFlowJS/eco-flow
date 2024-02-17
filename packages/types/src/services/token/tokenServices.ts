export interface TokenServices {
  checkToken(token: string, userId: string): Promise<boolean>;
  generateToken(_id: string): Promise<[string, string, number]>;
  removeToken(token: string, userId: string): Promise<void>;
}
