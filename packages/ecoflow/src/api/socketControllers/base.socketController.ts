import { Socket } from "socket.io";

/**
 * Joins a user to a specified room using the provided Socket IO instance.
 * @param {Socket} io - The Socket IO instance to use for joining the room.
 * @param {string[]} room - The room or rooms to join the user to.
 * @returns None
 */
const joinRoom = (io: Socket) => (room: string[]) => {
  const { log } = ecoFlow;
  io.join(room);
  log.info("user connected " + room.toString());
};

export { joinRoom };
