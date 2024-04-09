import { DataSource } from 'typeorm'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { getDataSourceOptions } from '~/database/data-source'

export const testDBName = 'api-test'

export function mkTestDBOptions(): PostgresConnectionOptions {
  const originalOptions = getDataSourceOptions()
  return { ...originalOptions, database: testDBName }
}

export async function mkTestDataSource() {
  const dataSource = new DataSource(mkTestDBOptions())
  await dataSource.initialize()
  return dataSource
}
