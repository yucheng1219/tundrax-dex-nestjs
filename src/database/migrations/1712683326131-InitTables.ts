import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitTables1712683326131 implements MigrationInterface {
  name = 'InitTables1712683326131'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_035190f70c9aff0ef331258d28" ON "user" ("fullName") `)
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "cat" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "breed" character varying NOT NULL, CONSTRAINT "PK_7704d5c2c0250e4256935ae31b4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`
    )
    await queryRunner.query(`DROP TABLE "cat"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`)
    await queryRunner.query(`DROP TABLE "session"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_035190f70c9aff0ef331258d28"`)
    await queryRunner.query(`DROP TABLE "user"`)
  }
}
