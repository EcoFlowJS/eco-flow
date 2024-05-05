/**
 * Checks if the application is set up correctly by verifying the presence of required environment variables
 * and authentication settings.
 * @returns {boolean} Returns true if the application is properly configured, false otherwise.
 */
const isCreateApp = (): boolean => {
  const { _, isAuth } = ecoFlow;
  let result = true;
  const {
    ECOFLOW_SYS_TOKEN_SECRET,
    ECOFLOW_SYS_TOKEN_SALT,
    ECOFLOW_SYS_CRYPTION_KEY,
    ECOFLOW_SYS_ADMINCLI_TOKEN,
    ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN,
  } = process.env;

  if (
    _.isEmpty(ECOFLOW_SYS_TOKEN_SECRET) ||
    _.isEmpty(ECOFLOW_SYS_TOKEN_SALT) ||
    _.isEmpty(ECOFLOW_SYS_CRYPTION_KEY) ||
    _.isEmpty(ECOFLOW_SYS_ADMINCLI_TOKEN)
  )
    result = false;

  if (!isAuth && _.isEmpty(ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN)) result = false;
  return result;
};

export default isCreateApp;
