import { textSpanIntersectsWithPosition } from "typescript";
import { Encrypter } from "../../encryption";

interface Session {
  id: string;
  name: string;
  token: string;
  type: string;
}

export class LocalSession {
  static setSession(session: Session) {
    localStorage.setItem("access_token", Encrypter.encrypt(session.token));
    localStorage.setItem("name", Encrypter.encrypt(session.name));
    localStorage.setItem("id", Encrypter.encrypt(session.id));
    localStorage.setItem("user_type", Encrypter.encrypt(session.type));
  }

  static emptySession: Session = {
    id: "",
    name: "",
    token: "",
    type: "",
  };

  static getSession(): Session {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("id")!.toString() !== ""
    ) {
      return {
        id: Encrypter.desencrypt(localStorage.getItem("id")!.toString()),
        name: Encrypter.desencrypt(localStorage.getItem("name")!.toString()),
        token: Encrypter.desencrypt(
          localStorage.getItem("access_token")!.toString()
        ),
        type: Encrypter.desencrypt(
          localStorage.getItem("user_type")!.toString()
        ),
      };
    }
    return this.emptySession;
  }

  static clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("user_type");
  }

  static isLogged() {
    const session = this.getSession();
    if (
      !session.id ||
      session.id === "" ||
      !session.name ||
      session.name === "" ||
      !session.type ||
      (session.type !== "Estudiante" && session.type !== "Académico") ||
      !session.token ||
      session.token === ""
    ) {
      return false;
    }
    return true;
  }
}
