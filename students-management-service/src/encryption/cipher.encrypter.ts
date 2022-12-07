import { Cipher, createCipheriv, createDecipheriv, Decipher } from 'crypto';
import { iv, key } from './constants.crypto';

export abstract class Encrypter {
  static cipher: Cipher = undefined;
  static decipher: Decipher = undefined;

  private static getCipher = async (): Promise<Cipher> => {
    return createCipheriv('aes-256-cbc', key, iv);
  };

  private static getDescipher = async (): Promise<Decipher> => {
    return createDecipheriv('aes-256-cbc', key, iv);
  };

  static encrypt = async (value: string): Promise<string> => {
    this.cipher = await this.getCipher();
    let encripyted = this.cipher.update(value, 'utf8', 'base64');
    encripyted += this.cipher.final('base64');
    return encripyted;
  };

  static desencrypt = async (value: string): Promise<string> => {
    this.decipher = await this.getDescipher();
    let decrypted = this.decipher.update(value, 'base64', 'utf8');
    decrypted += this.decipher.final('utf8');
    return decrypted;
  };
}
