import { SocketServer } from "@eco-flow/types";
import baseEvents from "./baseEvents/baseEvents";
import roleEvents from "./roleEvents/roleEvents";
import userEvents from "./userEvents/userEvents";

const socketEvents = (socketServer: SocketServer) => {
  baseEvents(socketServer);
  roleEvents(socketServer);
  userEvents(socketServer);
};

export default socketEvents;
