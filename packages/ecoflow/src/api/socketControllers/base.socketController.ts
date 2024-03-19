import { Socket } from "socket.io";

const joinRoom = (io: Socket) => (room: string[]) => {
  const { log } = ecoFlow;
  io.join(room);
  log.info("Room joined");
};

export { joinRoom };
