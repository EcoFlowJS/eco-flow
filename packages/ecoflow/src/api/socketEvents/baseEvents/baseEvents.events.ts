import { joinRoom } from "../../socketControllers/base.socketController";
import { SocketServer } from "@ecoflow/types";

/**
 * Sets up base events for the socket server, such as joining a room.
 * @param {SocketServer} socket - The socket server object.
 * @returns None
 */
const baseEvents = ({ socket }: SocketServer) => {
  socket.on("join", joinRoom(socket));
};

export default baseEvents;
