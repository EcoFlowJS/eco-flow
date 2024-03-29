import { joinRoom } from "../../socketControllers/base.socketController";
import { SocketServer } from "@ecoflow/types";

const baseEvents = ({ socket }: SocketServer) => {
  socket.on("join", joinRoom(socket));
};

export default baseEvents;
