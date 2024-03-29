import getUserRoles from "../../socketControllers/roleSocketController/getUserRoles.socketController";
import { SocketServer } from "@ecoflow/types";

const roleEvents = ({ io, socket }: SocketServer) => {
  socket.on("fetchRole", getUserRoles(io));
};

export default roleEvents;
