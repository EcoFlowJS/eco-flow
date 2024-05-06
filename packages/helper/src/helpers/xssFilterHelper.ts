import _ from "lodash";

/**
 * Sanitize input string to prevent Cross-Site Scripting (XSS) attacks by replacing
 * special characters with their corresponding HTML entities.
 * @param {string} input - The input string to sanitize
 * @returns {string} The sanitized string with special characters replaced by HTML entities
 */
const xssFilterHelper = (input: string): string => {
  const lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g;
  return input
    .toString()
    .replace(lt, "&lt;")
    .replace(gt, "&gt;")
    .replace(ap, "&#39;")
    .replace(ic, "&#34;");
};

export default xssFilterHelper;
