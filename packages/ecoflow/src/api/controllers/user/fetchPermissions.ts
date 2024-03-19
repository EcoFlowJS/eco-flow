import { ApiResponse, Permissions, Role } from "@eco-flow/types";
import { Context } from "koa";
import roleAdmin from "../../../defaults/roleAdmin.default";

const fetchPermissions = async (ctx: Context) => {
  const { username } = ctx.params;
  const { _, service } = ecoFlow;

  if (_.isUndefined(username)) throw "Username must be specified";

  const { UserService, RoleService } = service;

  try {
    const userRoles: Array<any> = (<any>(
      (await UserService.getUserAllInfo(username)).user!
    )).roles;

    let roles = Object.create({});
    for await (const userRole of userRoles) {
      const role: Role = ((await RoleService.fetchRole(userRole)) as Role[])[0];
      if (role.isDefault) {
        roles = roleAdmin;
        break;
      }

      Object.keys(role.permissions as Permissions).map((rolekey: string) => {
        if ((role.permissions as Permissions)[rolekey]) roles[rolekey] = true;
      });
    }
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: roles,
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
