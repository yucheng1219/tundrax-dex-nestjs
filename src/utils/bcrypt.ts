import bcrypt from "bcrypt";

/**
 * @param password
 * @returns
 */
export async function bcryptHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const result = bcrypt.hash(password, salt);
  return result;
}

/**
 * Use async method if possible
 * @param password
 * @param hash
 * @returns
 */
export function bcryptCheckHash(
  password: string,
  hash: string | null | undefined
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, hash);
}
