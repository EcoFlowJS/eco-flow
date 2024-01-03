import bcrypt from "bcrypt";

export default async (val: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(val, hash);
};
