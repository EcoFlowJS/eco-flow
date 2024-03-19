import { Permissions, Role } from "@eco-flow/types";
import { Server } from "socket.io";
import roleAdmin from "../../../defaults/roleAdmin.default";

const getUserRoles =
  (io: Server) =>
  async ({ roomID, UserID }: any) => {
    const { service } = ecoFlow;
    const userRoles: Array<any> = (<any>(
      (await service.UserService.getUserAllInfo(UserID)).user!
    )).roles;

    let roles = Object.create({});
    for await (const userRole of userRoles) {
      const role: Role = (
        (await service.RoleService.fetchRole(userRole)) as Role[]
      )[0];
      if (role.isDefault) {
        roles = roleAdmin;
        break;
      }

      Object.keys(role.permissions as Permissions).map((rolekey: string) => {
        if ((role.permissions as Permissions)[rolekey]) roles[rolekey] = true;
      });
    }

    io.to(roomID).emit("roleUpdateResponse", roles);
  };

export default getUserRoles;
