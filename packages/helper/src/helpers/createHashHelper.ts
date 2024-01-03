import bcrypt from "bcrypt";

export default async (val: any): Promise<string> => {
  return await bcrypt.hash(val, await bcrypt.genSalt(3));
};
