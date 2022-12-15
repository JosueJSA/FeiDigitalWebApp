import { io, Manager, Socket } from "socket.io-client";
import { ACADEMIC_SERVICE } from "../../constants";
import { LocalSession } from "../../shared/session";
import { Academic } from "./interfaces/academic.interface";

export abstract class AcademicSocket {
  static socket: Socket = io();

  static manager = new Manager(ACADEMIC_SERVICE, {
    rejectUnauthorized: false,
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
  });

  static managerAuthorized = new Manager(ACADEMIC_SERVICE, {
    rejectUnauthorized: false,
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
  });

  static initializeSocket = () => {
    this.manager.open((error) => {
      if (error) {
        console.log("Algo salió mal");
      } else {
        console.log("Todo estuvo gucci");
      }
    });
  };

  static killSockets = () => {
    this.manager.removeAllListeners();
    this.manager._close();
    this.managerAuthorized.removeAllListeners();
    this.manager = new Manager(ACADEMIC_SERVICE, {
      rejectUnauthorized: false,
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
    });
    this.managerAuthorized = new Manager(ACADEMIC_SERVICE, {
      rejectUnauthorized: false,
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
    });
  };

  static getInstance = (): Socket => (this.socket = this.manager.socket("/"));

  static getInstanceWithToken = (): Socket => {
    const socket = (this.socket = this.managerAuthorized.socket("/", {
      auth: {
        token: LocalSession.getSession().token,
      },
    }));
    return socket;
  };

  static getCurrentSocket = () => this.socket;

  static signInEvent = (email: string, password: string): Socket => {
    this.socket.emit("sign-in-academic", { email: email, password: password });
    return this.socket;
  };

  static addAcademicEvent(academic: Academic, academicCode: string): Socket {
    this.socket.emit("add-academic", {
      email: academic.email,
      fullName: academic.fullName,
      password: academic.password,
      position: academic.position,
      feiLocationCode: "#113",
      academicCode: academicCode,
    });
    return this.socket;
  }

  static getAcademicEvent(id: string): Socket {
    this.socket.emit("get-academic", { id: id });
    return this.socket;
  }

  static getShortAcademicEvent(id: string): Socket {
    this.socket.emit("get-short-academic", { id: id });
    return this.socket;
  }

  static searchAcademicsEvent(email?: string, fullName?: string): Socket {
    this.socket.emit("search-academics", { email: email, fullName: fullName });
    return this.socket;
  }

  static updateAcademicEvent(id: string, academic: Academic): Socket {
    this.socket.emit("update-academic", {
      id: id,
      academic: {
        email: academic.email,
        fullName: academic.fullName,
        password: academic.password,
        position: academic.position,
        status: academic.status,
        feiLocationCode: "FEO109",
      },
    });
    return this.socket;
  }
}
