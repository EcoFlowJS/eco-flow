import { Crypto as ICrypto } from "@eco-flow/types";
import bcrypt from "bcrypt";

export class Crypto implements ICrypto {
  private hashKey: string;
  constructor(key: string = process.env.ECOFLOW_SYS_CRYPTION_KEY!) {
    this.hashKey = key;
  }

  async createHash(val: any): Promise<string> {
    return await bcrypt.hash(val, await bcrypt.genSalt(3));
  }
  async compareHash(val: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(val, hash);
  }
}
