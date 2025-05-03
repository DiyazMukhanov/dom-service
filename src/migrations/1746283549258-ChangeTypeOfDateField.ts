import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeOfDateField1746283549258 implements MigrationInterface {
  name = 'ChangeTypeOfDateField1746283549258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_requests" DROP COLUMN "workDate"`,
    );
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "workDate" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_requests" DROP COLUMN "workDate"`,
    );
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "workDate" date`);
  }
}
