import { hash as _hash, genSaltSync, compare } from 'bcrypt';

export async function hashPassword (password) {
  return _hash(password, genSaltSync(8), null);
}

export async function comparePassword (password, hash) {
  const passwordsMatch = await compare(password, hash);
  return passwordsMatch;
}
