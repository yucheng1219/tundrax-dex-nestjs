import { compare, hash } from 'bcrypt'

/**
 * @param password
 * @returns
 */
export async function bcryptHash(password: string): Promise<string> {
  const result = await hash(password, 12)
  return result
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
    return Promise.resolve(false)
  }
  return compare(password, hash)
}
