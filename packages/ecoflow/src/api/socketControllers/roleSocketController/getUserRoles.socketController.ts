import { Permissions, Role } from "@ecoflow/types";
import { Server } from "socket.io";
import roleAdmin from "../../../defaults/roleAdmin.default";

/**
 * Retrieves user roles for a given room ID and emits a role update response to the specified socket.io server.
 * @param {Server} io - The socket.io server instance.
 * @returns {Function} An asynchronous function that takes in an object with a roomID property.
 */
const getUserRoles =
  (io: Server) =>
  /**
   * Asynchronously updates the roles of a user in a specific room and emits a response to the room.
   * @param {any} roomID - The ID of the room where the user's roles are updated.
   * @returns None
   */
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
