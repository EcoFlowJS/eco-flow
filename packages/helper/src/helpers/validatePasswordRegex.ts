/**
 * Validates a password using a regular expression.
 * The password must contain at least one digit, one special character, one lowercase letter,
 * one uppercase letter, and be at least 8 characters long.
 * @param {string} value - The password to validate
 * @returns {boolean} - True if the password meets the criteria, false otherwise
 */
const validatePasswordRegex = (value: string): boolean =>
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);

export default validatePasswordRegex;
