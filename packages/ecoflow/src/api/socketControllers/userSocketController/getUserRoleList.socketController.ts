import { Server } from "socket.io";

const getUserRoleList =
  (io: Server) =>
  async ({ roomID, UserID }: any) => {
    const { UserService } = ecoFlow.service;
    io.to(roomID).emit(
      "userRoleListUpdateResponse",
      (await UserService.getUserInfos(UserID)).user!.roles
    );
  };

export default getUserRoleList;
