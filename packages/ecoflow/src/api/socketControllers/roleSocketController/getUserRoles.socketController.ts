import { Permissions, Role } from "@ecoflow/types";
import { Server } from "socket.io";
import roleAdmin from "../../../defaults/roleAdmin.default";

const getUserRoles =
  (io: Server) =>
  async ({ roomID }: any) => {
    const { UserService, RoleService } = ecoFlow.service;
    const isActiveUser = await UserService.isActiveUser(roomID);
    const userRoles: any[] =
      (await UserService.getUserInfos(roomID)).user?.roles || [];

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

    io.to(roomID).emit("roleUpdateResponse", { isActiveUser, roles });
  };

export default getUserRoles;
