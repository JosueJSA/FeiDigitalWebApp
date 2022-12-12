import CryptoJS, { AES, enc } from "crypto-js";

export abstract class Encrypter {
  static key: string = "my_key_full4k180fps_x_q_estoy_aquí";

  static encrypt = (value: string): string => {
    return AES.encrypt(value, this.key).toString();
  };

  static desencrypt = (value: string): string => {
    const decrypted = AES.decrypt(value, this.key);
    if (decrypted) return decrypted.toString(enc.Utf8);
    else return "error";
  };
}
