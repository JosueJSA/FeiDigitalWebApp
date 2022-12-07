import { io, Manager, Socket } from "socket.io-client";
import { ACADEMIC_SESSIONS_SERVICE } from "../../../constants";
import { LocalSession } from "../../../shared/session";
import { ClassSession, Course } from "./interfaces";

export abstract class AcademicSessionsSocket {
  static courseSocket: Socket = io();
  static sessionSocket: Socket = io();

  static manager = new Manager(ACADEMIC_SESSIONS_SERVICE, {
    rejectUnauthorized: false,
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
  });

  static killSockets = () => {
    this.manager.removeAllListeners();
    this.manager._close();
    this.manager = new Manager(ACADEMIC_SESSIONS_SERVICE, {
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

  static getCourseInstanceWithToken = (): Socket => {
    return (this.courseSocket = this.manager.socket("/courses", {
      auth: {
        token: LocalSession.getSession().token,
      },
    }));
  };

  static getSessionInstanceWithToken = (): Socket => {
    return (this.sessionSocket = this.manager.socket("/sessions", {
      auth: {
        token: LocalSession.getSession().token,
      },
    }));
  };

  static addCourseEvent(course: Course): Socket {
    this.courseSocket.emit("add-course", {
      idAcademicPersonal: course.idAcademicPersonal,
      name: course.name,
      nrc: course.nrc,
    });
    return this.courseSocket;
  }

  static getCoursesEvent(idAcademic: string): Socket {
    this.courseSocket.emit("get-course-by-academic", {
      idAcademic: idAcademic,
    });
    return this.courseSocket;
  }

  static updateCourseEvent(nrc: string, course: Course): Socket {
    this.courseSocket.emit("update-course", {
      nrc: nrc,
      course: {
        nrc: course.nrc,
        name: course.name,
        idAcademicPersonal: course.idAcademicPersonal,
      },
    });
    return this.courseSocket;
  }

  static deleteCourseEvent(nrc: string): Socket {
    this.courseSocket.emit("delete-course", {
      nrc: nrc,
    });
    return this.courseSocket;
  }

  static addClassSessionEvent(classSession: ClassSession): Socket {
    this.sessionSocket.emit("add-class-session", {
      classDate: classSession.classDate,
      initialTime: classSession.initialTime,
      endTime: classSession.endTime,
      repeated: classSession.repeated,
      courseNrc: classSession.courseNrc,
      classroomCode: classSession.classroomCode,
      classDateEnd: classSession.classDateEnd,
    });
    return this.sessionSocket;
  }

  static getSessionsByCourseEvent(nrc: string): Socket {
    this.sessionSocket.emit("get-sessions-by-course", { nrc: nrc });
    return this.sessionSocket;
  }

  static getSessionDetailedForAcademics(
    idAcademic: string,
    date: Date
  ): Socket {
    this.sessionSocket.emit("get-sessions-for-academic", {
      date: date,
      idAcademic: idAcademic,
    });
    return this.sessionSocket;
  }

  static getSessionActivated(idAcademic: string): Socket {
    this.sessionSocket.emit("get-actived-session-by-academic", {
      idAcademic: idAcademic,
    });
    return this.sessionSocket;
  }

  static updateClassSessionEvent(
    id: string,
    classSession: ClassSession
  ): Socket {
    this.sessionSocket.emit("update-class-session", {
      id: id,
      session: {
        classDate: classSession.classDate,
        initialTime: classSession.initialTime,
        endTime: classSession.endTime,
        repeated: classSession.repeated,
        courseNrc: classSession.courseNrc,
        classroomCode: classSession.classroomCode,
        classDateEnd: classSession.classDateEnd,
      },
    });
    return this.sessionSocket;
  }

  static deleteSessionEvent(id: string): Socket {
    this.sessionSocket.emit("delete-class-session", {
      id: id,
    });
    return this.sessionSocket;
  }

  static startSessionEvent(id: string): Socket {
    this.sessionSocket.emit("start-class-session", {
      idClass: id,
    });
    return this.sessionSocket;
  }

  static endSessionEvent(id: string): Socket {
    this.sessionSocket.emit("end-class-session", {
      idClass: id,
    });
    return this.sessionSocket;
  }
}
