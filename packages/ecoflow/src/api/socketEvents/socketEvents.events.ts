import { SocketServer } from "@ecoflow/types";
import baseEvents from "./baseEvents/baseEvents.events.js";
import roleEvents from "./roleEvents/roleEvents.events.js";
import userEvents from "./userEvents/userEvents.events.js";

/**
 * Sets up socket events for the given SocketServer by calling baseEvents, roleEvents, and userEvents.
 * @param {SocketServer} socketServer - The SocketServer instance to set up events on.
 * @returns None
 */
const socketEvents = (socketServer: SocketServer) => {
  baseEvents(socketServer);
  roleEvents(socketServer);
  userEvents(socketServer);
};

export default socketEvents;
