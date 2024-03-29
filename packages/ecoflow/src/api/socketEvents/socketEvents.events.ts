import { SocketServer } from "@ecoflow/types";
import baseEvents from "./baseEvents/baseEvents.events";
import roleEvents from "./roleEvents/roleEvents.events";
import userEvents from "./userEvents/userEvents.events";

const socketEvents = (socketServer: SocketServer) => {
  baseEvents(socketServer);
  roleEvents(socketServer);
  userEvents(socketServer);
};

export default socketEvents;
