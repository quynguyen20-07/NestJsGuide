import * as bcrypt from 'bcrypt';
export const hashPassword = (pass: string) => bcrypt.hash(pass, 10);
