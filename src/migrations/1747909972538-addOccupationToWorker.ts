import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOccupationToWorker1747909972538 implements MigrationInterface {
  name = 'AddOccupationToWorker1747909972538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workers" ADD "occupation_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "workers" ADD CONSTRAINT "FK_c84f30b4f975e91fb849443cc3d" FOREIGN KEY ("occupation_id") REFERENCES "occupations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workers" DROP CONSTRAINT "FK_c84f30b4f975e91fb849443cc3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workers" DROP COLUMN "occupation_id"`,
    );
  }
}
