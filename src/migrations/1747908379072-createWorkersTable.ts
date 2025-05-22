import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkersTable1747908379072 implements MigrationInterface {
  name = 'CreateWorkersTable1747908379072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workers" ("id" SERIAL NOT NULL, "phoneNumber" character varying NOT NULL, "fullName" character varying NOT NULL, "rating" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_e950c9aba3bd84a4f193058d838" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "workers"`);
  }
}
