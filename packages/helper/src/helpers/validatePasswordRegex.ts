const validatePasswordRegex = (value: string): boolean =>
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);

export default validatePasswordRegex;
