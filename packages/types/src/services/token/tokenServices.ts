export interface TokenServices {
  getAllTokens(): Promise<Tokens[]>;
  checkToken(token: string, userId: string): Promise<boolean>;
  generateToken(_id: string): Promise<[string, string, number]>;
  removeToken(token: string, userId: string): Promise<void>;
  migrateToken(token: Tokens): Promise<void>;
}

export interface Tokens {
  _id?: string;
  userId: String;
  token: String;
  created_at: number | Date;
  updated_at: number | Date;
  expires_at: number | Date;
}
