import { Server } from "socket.io";

/**
 * Retrieves the list of user roles for a given room ID and emits an event to update the user role list.
 * @param {Server} io - The server object to emit events.
 * @returns {Function} An asynchronous function that takes in an object with a roomID property.
 */
const getUserRoleList =
  (io: Server) =>
  /**
   * Asynchronously updates the user role list in a specific room.
   * @param {object} param0 - An object containing the room ID.
   * @param {string} param0.roomID - The ID of the room to update the user role list.
   * @returns None
   */
  async ({ roomID }: any) => {
    const { UserService } = ecoFlow.service;
    const isActiveUser = await UserService.isActiveUser(roomID);
    io.to(roomID).emit("userRoleListUpdateResponse", {
      isActiveUser,
      roles: (await UserService.getUserInfos(roomID)).user?.roles || [],
    });
  };

export default getUserRoleList;
