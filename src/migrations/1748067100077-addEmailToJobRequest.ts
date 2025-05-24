import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToJobRequest1748067100077 implements MigrationInterface {
    name = 'AddEmailToJobRequest1748067100077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "email"`);
    }

}
