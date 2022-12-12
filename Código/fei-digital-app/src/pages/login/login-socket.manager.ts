import { io, Manager, Socket } from "socket.io-client";
import { ACADEMIC_SERVICE } from "../../constants";

export abstract class LoginSocket {
  static socket: Socket = io();

  static manager = new Manager(ACADEMIC_SERVICE, {
    reconnection: false,
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
  });

  static killSockets = () => {
    this.manager.removeAllListeners();
    this.manager._close();
    this.manager = new Manager(ACADEMIC_SERVICE, {
      reconnection: false,
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
    });
  };

  static initializeSocket = () => {
    this.manager.open((error) => {
      if (error) {
        console.log("Algo salió mal");
      } else {
        console.log("Todo estuvo gucci");
      }
    });
  };

  static getInstance = (): Socket => {
    this.socket = this.manager.socket("/");
    if (this.socket.disconnected) this.socket.connect();
    return this.socket;
  };

  static getCurrentSocket = () => this.socket;

  static signInEvent = (email: string, password: string): Socket => {
    this.socket.emit("sign-in-academic", { email: email, password: password });
    return this.socket;
  };
}
