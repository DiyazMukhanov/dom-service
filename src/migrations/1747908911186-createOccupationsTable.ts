import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOccupationsTable1747908911186 implements MigrationInterface {
  name = 'CreateOccupationsTable1747908911186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "occupations" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "UQ_521e470b29a170abf83492d5e83" UNIQUE ("title"), CONSTRAINT "PK_0bf09083dd897df1e8ebb96b5c1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "occupations"`);
  }
}
