import {
  ApiResponse,
  Permissions,
  Role,
  RoleService,
  UserService,
} from "@eco-flow/types";
import { Context } from "koa";
import roleAdmin from "../../../defaults/roleAdmin.default";

const fetchRoleList = async (
  UserService: UserService,
  username: string
): Promise<any[]> => {
  return (await UserService.getUserInfos(username)).user?.roles || [];
};

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

const fetchPermissions = async (ctx: Context) => {
  const { mode } = ctx.params;
  const { _, service } = ecoFlow;

  const { UserService, RoleService } = service;

  try {
    const username = ctx.user;
    const payload = Object.create({});

    if (_.isUndefined(mode)) {
      const userRoles = await fetchRoleList(UserService, username);
      const permissionList = await fetchpermissionList(RoleService, userRoles);
      payload["rolesList"] = userRoles;
      payload["permissions"] = permissionList;
    }

    if (mode === "RoleList") {
      payload["rolesList"] = await fetchRoleList(UserService, username);
    }

    if (mode === "Permissions") {
      const userRoles = await fetchRoleList(UserService, username);
      const permissionList = await fetchpermissionList(RoleService, userRoles);
      payload["permissions"] = permissionList;
    }

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: payload,
    };
  } catch (error) {
    console.log(error);

    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchPermissions;
