import bcrypt from "bcrypt";

/**
 * Compare a value with a hash using bcrypt for encryption.
 * @param {string} val - The value to compare.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the value matches the hash, false otherwise.
 */
const compareHashHelper = async (
  val: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(val, hash);
};

export default compareHashHelper;
