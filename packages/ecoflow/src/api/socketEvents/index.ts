import baseEvents from "./baseEvents/baseEvents";
import roleEvents from "./roleEvents/roleEvents";
import { SocketServer } from "@eco-flow/types";

const socketEvents = (socketServer: SocketServer) => {
  baseEvents(socketServer);
  roleEvents(socketServer);
};

export default socketEvents;
