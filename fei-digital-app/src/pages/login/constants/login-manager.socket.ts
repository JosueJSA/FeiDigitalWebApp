import { Manager } from "socket.io-client";
import { ACADEMIC_SERVICE } from "../../../constants";

export const manager = new Manager(ACADEMIC_SERVICE, {
  autoConnect: false,
  transports: ["websocket"],
  reconnectionDelayMax: 10000,
});
