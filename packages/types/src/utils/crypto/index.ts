export interface Crypto {
  createHash(val: any): Promise<string>;
  compareHash(val: string, hash: string): Promise<boolean>;
}
