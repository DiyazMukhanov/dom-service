import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveForWorker1747918509447 implements MigrationInterface {
    name = 'AddIsActiveForWorker1747918509447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "workDate" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "workDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "isActive"`);
    }

}
