export default (env: string): string | undefined => {
  if (env.startsWith("env(") && env.endsWith(")")) {
    return process.env[env.substring(4, env.length - 1)];
  }
  return env;
};
