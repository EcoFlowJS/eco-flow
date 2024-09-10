import getUserRoles from "../../socketControllers/roleSocketController/getUserRoles.socketController.js";
import { SocketServer } from "@ecoflow/types";

/**
 * Sets up event listener on the socket to fetch user roles.
 * @param {SocketServer} io - The socket server object.
 * @param {Socket} socket - The socket object.
 * @returns None
 */
const roleEvents = ({ io, socket }: SocketServer) => {
  socket.on("fetchRole", getUserRoles(io));
};

export default roleEvents;
