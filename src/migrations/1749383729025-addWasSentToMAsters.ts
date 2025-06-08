import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWasSentToMAsters1749383729025 implements MigrationInterface {
    name = 'AddWasSentToMAsters1749383729025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "wasSentToMasters" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "wasSentToMasters"`);
    }

}
