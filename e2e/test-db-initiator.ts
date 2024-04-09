import { createDatabase, dropDatabase } from 'typeorm-extension'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { getDataSourceOptions } from '~/database/data-source'
import { mkTestDBOptions, mkTestDataSource, testDBName } from './mk-test-data-source'

export class TestDBInitiator {
  private static readonly testDB = 'api_test'
  private readonly initDB: string
  readonly dbOptions: PostgresConnectionOptions
  constructor() {
    const { database } = getDataSourceOptions()
    this.dbOptions = mkTestDBOptions()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.initDB = database!
  }

  async createDb() {
    await this.dropDb()
    console.log(`Creating test database '${testDBName}'`)
    await createDatabase({
      options: this.dbOptions,
      initialDatabase: this.initDB,
      ifNotExist: false,
    })
    const dataSource = await mkTestDataSource()

    console.log('Running migrations')
    dataSource.runMigrations({ transaction: 'all' })
    await dataSource.destroy()

    console.log('✓ Done. Test database is ready to accept connections ✓\n')
  }

  async dropDb() {
    console.log(`Dropping test database '${testDBName}'`)
    dropDatabase({
      options: this.dbOptions,
      initialDatabase: this.initDB,
    })
  }
}
