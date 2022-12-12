import { io, Socket } from "socket.io-client";
import { LocalSession } from "../session";

export abstract class SocketIo {
  static createSocket(gateway: string): Socket {
    return io(gateway, {
      transports: ["websocket"],
      auth: { token: LocalSession.getSession().token },
    });
  }

  static isInitialized(socket: Socket): boolean {
    try {
      if (socket.connected) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  static verifySession() {
    if (!LocalSession.isLogged()) {
      throw new Error("No se cuenta con una sesión en el sistema");
    }
  }

  static closeSocket(socket: Socket) {
    try {
      if (socket) {
        if (socket.connected) socket.close();
      }
    } catch (error) {}
  }
}
