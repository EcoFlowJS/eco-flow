export default (): boolean => {
  const { _, isAuth } = ecoFlow;
  let result = false;
  const {
    ECOFLOW_SYS_TOKEN_SECRET,
    ECOFLOW_SYS_TOKEN_SALT,
    ECOFLOW_SYS_CRYPTION_KEY,
    ECOFLOW_SYS_ADMINCLI_TOKEN,
    ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN,
    ECOFLOW_SYS_DB_CLIENT,
    // ECOFLOW_SYS_DB_HOST,
    // ECOFLOW_SYS_DB_PORT,
    // ECOFLOW_SYS_DB_USER,
    // ECOFLOW_SYS_DB_PASS,
    // ECOFLOW_SYS_DB_DATABASE,
    // ECOFLOW_SYS_DB_CONNECTION_STRING,
    // ECOFLOW_SYS_DB_FILENAME,
    // ECOFLOW_SYS_DB_SOCKET,
    // ECOFLOW_SYS_DB_SSL,
  } = process.env;

  if (
    _.isEmpty(ECOFLOW_SYS_TOKEN_SECRET) ||
    _.isEmpty(ECOFLOW_SYS_TOKEN_SALT) ||
    _.isEmpty(ECOFLOW_SYS_CRYPTION_KEY) ||
    _.isEmpty(ECOFLOW_SYS_ADMINCLI_TOKEN)
  )
    result = true;

  if (!isAuth && _.isEmpty(ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN)) result = true;

  if (isAuth && _.isEmpty(ECOFLOW_SYS_DB_CLIENT)) result = true;

  return result;
};
