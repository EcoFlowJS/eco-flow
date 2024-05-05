import { SocketServer } from "@ecoflow/types";
import getUserRoleList from "../../socketControllers/userSocketController/getUserRoleList.socketController";

/**
 * Sets up user events for the socket server.
 * @param {SocketServer} io - The socket server object.
 * @param {Socket} socket - The socket object.
 * @returns None
 */
const userEvents = ({ io, socket }: SocketServer) => {
  socket.on("fetchUserRoleListUpdate", getUserRoleList(io));
};

export default userEvents;
