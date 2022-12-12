import { createHash } from 'crypto';

export const iv = Buffer.from('fb5da54a07460aa0').toString('hex').slice(0, 16);
export const key = createHash('sha256')
  .update(String('dieodj'))
  .digest('base64')
  .substring(0, 32);
