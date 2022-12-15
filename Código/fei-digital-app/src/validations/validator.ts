export class Validator {
  static checkMail(email: string) {
    if (!email || email.length <= 0) throw new Error("Se requiere el email");
    if (!!/\s/.test(email))
      throw new Error("El email no debe contener espacios en blanco");
    if (email.length <= 5)
      throw new Error("Se requiere un email mayor a 5 caracteres");
    if (email.length > 99)
      throw new Error("El email no puede tener más de 99 caracteres");
  }

  static checkPassword(password: string) {
    if (password.length <= 0) throw new Error("Se requiere la contraseña");
    if (!!/\s/.test(password))
      throw new Error("La contrseña no debe contener espacios en blanco");
    if (password.length < 8)
      throw new Error("Se requiere una contraseña de al menos 8 caracteres");
    if (password.length > 50)
      throw new Error("La contraseña no puede tener más de 50 caracteres");
  }

  static checkName(name: string) {
    if (!name || name.length < 5)
      throw new Error(
        "Se requiere que el nombre cuente con al menos 5 caracteres"
      );
    if (!!/^\s*$/.test(name))
      throw new Error("El nombre no puede tener solo espacios en blanco ");
    if (name.length > 99)
      throw new Error("El nombre no puede tener más de 99 caracteres");
  }

  static checkCourseName(name: string) {
    if (!name || name.length < 5)
      throw new Error(
        "Se requiere que el nombre del curso cuente con al menos 5 caracteres"
      );
    if (!!/^\s*$/.test(name))
      throw new Error(
        "El nombre del curso no puede tener solo espacios en blanco "
      );
    if (name.length > 99)
      throw new Error(
        "El nombre del curso no puede tener más de 99 caracteres"
      );
  }

  static checkCurseNrc(nrc: string) {
    if (nrc.length < 3)
      throw new Error("El NRC del curso no pude tener menos de 3 caracteres");
    if (!!/\s/.test(nrc))
      throw new Error("El NRC no debe contener espacios en blanco");
    if (nrc.length > 50)
      throw new Error("El NRC no puede tener más de 50 caracteres");
  }

  static checkSearchField(value: string) {
    if (!value || value.length <= 0)
      throw new Error("Se requiere un valor de búsqueda");
    if (!!/^\s*$/.test(value))
      throw new Error(
        "El valor de búsqueda puede tener solo espacios en blanco "
      );
    if (value.length > 99)
      throw new Error(
        "El valor de búsqueda no puede tener más de 99 caracteres"
      );
  }

  static checkSessionDates(initDate: Date, endDate: Date, compare: boolean) {
    if (compare) {
      if (initDate > endDate)
        throw new Error("La fecha de inicio no puede ser mayor a la de fin");
    }
  }

  static checkTimes(initTime: Date, endTime: Date) {
    if (initTime >= endTime)
      throw new Error(
        "La hora de inicio no puede ser mayor o igual a la de fin"
      );
  }
}
