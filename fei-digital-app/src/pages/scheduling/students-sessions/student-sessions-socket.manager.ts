import { io, Manager, Socket } from "socket.io-client";
import { STUDENT_SESSIONS_SERVICE } from "../../../constants";
import { LocalSession } from "../../../shared/session";
import { SearchCourseFilter } from "./interfaces";

export abstract class StudentSessionsSocket {
  static courseSocket: Socket = io();
  static sessionSocket: Socket = io();

  static manager = new Manager(STUDENT_SESSIONS_SERVICE, {
    rejectUnauthorized: false,
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
  });

  static killSockets = () => {
    this.manager.removeAllListeners();
    this.manager._close();
    this.manager = new Manager(STUDENT_SESSIONS_SERVICE, {
      rejectUnauthorized: false,
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

  static getSessionInstanceWithToken = (): Socket => {
    return (this.sessionSocket = this.manager.socket("/sessions", {
      auth: {
        token: LocalSession.getSession().token,
      },
    }));
  };

  static getCourseInstanceWithToken = (): Socket => {
    return (this.courseSocket = this.manager.socket("/courses", {
      auth: {
        token: LocalSession.getSession().token,
      },
    }));
  };

  static searchCoursesEvent(filter: SearchCourseFilter): Socket {
    this.courseSocket.emit("search-courses", {
      nrc: filter.nrc,
      name: filter.name,
    });
    return this.courseSocket;
  }

  static followCourse(idStudent: string, nrcCourse: string): Socket {
    this.courseSocket.emit("follow-course", {
      idStudent: idStudent,
      nrcCourse: nrcCourse,
    });
    return this.courseSocket;
  }

  static unFollowCourse(idStudent: string, nrcCourse: string): Socket {
    this.courseSocket.emit("unfollow-course", {
      idStudent: idStudent,
      nrcCourse: nrcCourse,
    });
    return this.courseSocket;
  }

  static getCoursesByFollowerEvent(idStudent: string): Socket {
    this.courseSocket.emit("get-courses-for-follower", {
      idStudent: idStudent,
    });
    return this.courseSocket;
  }

  static getSessionsByFollowerEvent(date: Date, idStudent: string): Socket {
    this.sessionSocket.emit("get-sessions-for-follower", {
      date: date,
      idFollower: idStudent,
    });
    return this.sessionSocket;
  }
}
