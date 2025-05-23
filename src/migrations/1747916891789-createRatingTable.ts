import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRatingTable1747916891789 implements MigrationInterface {
  name = 'CreateRatingTable1747916891789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "value" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workerId" integer, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_9b02ea13a286b21f58f76fe5703" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_9b02ea13a286b21f58f76fe5703"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workers" ADD "rating" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "ratings"`);
  }
}
