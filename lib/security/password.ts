import "server-only";

import bcrypt from "bcrypt";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");

export async function hashPassword(password: string) {
  return bcrypt.hash(password, Number.isFinite(saltRounds) ? saltRounds : 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
