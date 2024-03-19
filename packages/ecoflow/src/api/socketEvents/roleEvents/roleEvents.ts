import getUserRoles from "../../socketControllers/roleSocketController/getUserRoles.socketController";
import { SocketServer } from "@eco-flow/types";

const roleEvents = ({ io, socket }: SocketServer) => {
  socket.on("fetchRole", getUserRoles(io));
};

export default roleEvents;
