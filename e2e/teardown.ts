import 'tsconfig-paths/register'

module.exports = async () => {
  await globalThis.databaseConfig.dropDb(true)
}
