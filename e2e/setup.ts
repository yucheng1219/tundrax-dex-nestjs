import * as dotenv from 'dotenv'
import 'tsconfig-paths/register'
import { TestDBInitiator } from './test-db-initiator'

dotenv.config()

module.exports = async () => {
  console.log('\n\nSetup test environment')
  globalThis.databaseConfig = new TestDBInitiator()
  await globalThis.databaseConfig.createDb()
}
