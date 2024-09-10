import { ApiResponse, Role } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches the roles associated with the user in the given context.
 * @param {Context} ctx - The context object containing user information.
 * @returns None
 */
const fetchRoles = async (ctx: Context) => {
  const { _, service } = ecoFlow;

  /**
   * Retrieves user roles and fetches role names for each role ID.
   * Sets the response body with the success status and payload containing the role names.
   * If an error occurs, sets the response status to 409 and the payload with the error details.
   * @param {Object} service - An object containing UserService and RoleService.
   * @param {Object} ctx - The context object containing user information.
   * @returns None
   */
  try {
    const { UserService, RoleService } = service;
    const userRoles =
      (await UserService.getUserInfos(ctx.user)).user!.roles || [];

    const result = [];
    for await (const roleID of userRoles)
      result.push(((await RoleService.fetchRole(roleID)) as Role[])[0].name);

    ctx.body = <ApiResponse>{
      success: true,
      payload: result,
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchRoles;
