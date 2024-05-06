import {
  ApiResponse,
  Permissions,
  Role,
  RoleService,
  UserService,
} from "@ecoflow/types";
import { Context } from "koa";
import roleAdmin from "../../../defaults/roleAdmin.default";

/**
 * Fetches the role list for a given user from the UserService.
 * @param {UserService} UserService - The user service object used to fetch user information.
 * @param {string} username - The username of the user to fetch roles for.
 * @returns {Promise<any[]>} A promise that resolves to an array of roles for the user.
 */
const fetchRoleList = async (
  UserService: UserService,
  username: string
): Promise<any[]> =>
  (await UserService.getUserInfos(username)).user?.roles || [];

/**
 * Fetches the permission list based on the user roles.
 * @param {RoleService} RoleService - The service used to fetch roles.
 * @param {any[]} userRoles - The roles assigned to the user.
 * @returns An object containing the permissions based on the user roles.
 */
const fetchpermissionList = async (
  RoleService: RoleService,
  userRoles: any[]
) => {
  let roles = Object.create({});

  for await (const userRole of userRoles) {
    const role: Role = ((await RoleService.fetchRole(userRole)) as Role[])[0];
    if (role.isDefault) {
      roles = roleAdmin;
      break;
    }

    Object.keys(role.permissions as Permissions).map((rolekey: any) => {
      if ((role.permissions as Permissions)[rolekey]) roles[rolekey] = true;
    });
  }

  return roles;
};

/**
 * Fetches permissions based on the mode specified in the context object.
 * @param {Context} ctx - The context object containing parameters and services.
 * @returns None
 */
const fetchPermissions = async (ctx: Context) => {
  const { mode } = ctx.params;
  const { _, service } = ecoFlow;

  const { UserService, RoleService } = service;

  try {
    const username = ctx.user;
    const payload = Object.create({});

    /**
     * Checks if the mode is undefined. If it is, fetches the user's roles and permissions
     * and adds them to the payload object.
     * @param {any} mode - the mode to check for undefined
     * @returns None
     */
    if (_.isUndefined(mode)) {
      const userRoles = await fetchRoleList(UserService, username);
      const permissionList = await fetchpermissionList(RoleService, userRoles);
      payload["rolesList"] = userRoles;
      payload["permissions"] = permissionList;
    }

    /**
     * If the mode is "RoleList", fetch the roles list for the given username and update the payload object.
     * @param {string} mode - The mode to check against, should be "RoleList".
     * @param {object} payload - The payload object to update with the roles list.
     * @param {UserService} UserService - The service used to fetch the roles list.
     * @param {string} username - The username for which to fetch the roles list.
     * @returns None
     */
    if (mode === "RoleList")
      payload["rolesList"] = await fetchRoleList(UserService, username);

    /**
     * Checks if the mode is set to "Permissions" and fetches the list of user roles.
     * @param {string} mode - The mode to check against "Permissions".
     * @param {UserService} UserService - The service used to fetch user roles.
     * @param {string} username - The username of the user to fetch roles for.
     * @returns None
     */
    if (mode === "Permissions") {
      const userRoles = await fetchRoleList(UserService, username);

      /**
       * Fetches the permission list based on the user's roles using the RoleService.
       * Updates the payload object with the fetched permission list under the "permissions" key.
       * @param {RoleService} RoleService - The service used to fetch permissions based on roles.
       * @param {userRoles} userRoles - The roles of the user.
       * @returns None
       */
      const permissionList = await fetchpermissionList(RoleService, userRoles);
      payload["permissions"] = permissionList;
    }

    /**
     * Sets the status of the response to 200 and constructs a response body with the given payload.
     * @param {Context} ctx - The Koa context object representing the HTTP request and response.
     * @param {any} payload - The payload to include in the response body.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: payload,
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchPermissions;
