import bcrypt from "bcrypt";

/**
 * Asynchronously generates a hash for the given value using bcrypt.
 * @param {any} val - The value to be hashed.
 * @returns {Promise<string>} A promise that resolves to the generated hash.
 */
const createHashHelper = async (val: any): Promise<string> => {
  return await bcrypt.hash(val, await bcrypt.genSalt(3));
};

export default createHashHelper;
