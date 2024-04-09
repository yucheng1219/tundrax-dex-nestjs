// values in .env files are strings, this is a helper to convert them to boolean

// import { z } from "zod";

// // we need to allow booleans as well because we parse it again on server/zenv.ts
// export const ZStringBoolean = z.union([
//   z.enum(['true', 'false']).transform((s) => s === 'true'),
//   z.boolean(),
// ])
