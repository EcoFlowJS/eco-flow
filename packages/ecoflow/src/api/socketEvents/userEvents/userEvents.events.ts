import { SocketServer } from "@ecoflow/types";
import getUserRoleList from "../../socketControllers/userSocketController/getUserRoleList.socketController";

const userEvents = ({ io, socket }: SocketServer) => {
  socket.on("fetchUserRoleListUpdate", getUserRoleList(io));
};

export default userEvents;
