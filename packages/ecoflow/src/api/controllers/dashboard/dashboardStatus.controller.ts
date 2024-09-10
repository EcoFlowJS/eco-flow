import { ApiResponse } from "@ecoflow/types";
import { Builder } from "@ecoflow/utils/builder";
import { Context } from "koa";

const dashboardStatus = async (ctx: Context) => {
  const { _, ecoModule, database, router } = ecoFlow;
  const payload = Object.create({});

  /**
   * Retrieves the user environment from the Builder class and ensures it is an array.
   * If the user environment is not already an array, it is converted to a single-element array.
   * @returns {Array} An array containing the user environment(s).
   */
  let userEnvs = Builder.ENV.getUserEnv();
  if (!_.isArray(userEnvs)) userEnvs = [userEnvs];

  /**
   * Retrieves the stack of middleware functions for the API router.
   * @returns The stack of middleware functions for the API router.
   */
  const apiRouterStack = router.apiRouter.stack;

  try {
    /**
     * Updates the payload object with various counts and data from different sources.
     * - Updates the availablePackage count from ecoModule.
     * - Updates the installedPackage count from ecoModule.
     * - Updates the DBConnectionCount from the database connectionList.
     * - Updates the userEnvsNames by mapping the name property of each environment in userEnvs.
     * - Updates the routesStatus by mapping the path, method, and params of each route in apiRouterStack.
     * @returns None
     */
    payload.availablePackage = await ecoModule.availablePackagesCounts;
    payload.installedPackage = (await ecoModule.installedModules).length;
    payload.DBConnectionCount = database.connectionList.length;
    payload.userEnvsNames = userEnvs.map((env) => env.name);
    payload.routesStatus = apiRouterStack.map((routes) => ({
      path: routes.path,
      method: routes.methods.reduce(
        (acc, method) => (_.isEmpty(acc) ? method : `${acc}, ${method}`),
        ""
      ),
      params: routes.paramNames
        .map((param) => param.name)
        .reduce(
          (acc, param) => (_.isEmpty(acc) ? param : `${acc}, ${param}`),
          ""
        ),
    }));

    ctx.body = <ApiResponse>{
      success: true,
      payload,
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default dashboardStatus;
