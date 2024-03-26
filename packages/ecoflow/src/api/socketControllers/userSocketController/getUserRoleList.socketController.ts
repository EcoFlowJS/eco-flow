import { Server } from "socket.io";

const getUserRoleList =
  (io: Server) =>
  async ({ roomID }: any) => {
    const { UserService } = ecoFlow.service;
    const isActiveUser = await UserService.isActiveUser(roomID);
    io.to(roomID).emit("userRoleListUpdateResponse", {
      isActiveUser,
      roles: (await UserService.getUserInfos(roomID)).user?.roles || [],
    });
  };

export default getUserRoleList;
