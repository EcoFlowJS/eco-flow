import { createRequire } from "module";

/**
 * Require a module and invalidate the cache to ensure a fresh copy is loaded.
 * @param {string} id - The module identifier to require
 * @returns The required module
 */
const requireUncached = (id: string): any => {
  const require = createRequire(import.meta.url);
  delete require.cache[require.resolve(id)];
  return require(id);
};

export default requireUncached;
