import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHouseNotNull1748443687461 implements MigrationInterface {
    name = 'AddHouseNotNull1748443687461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "house" character varying`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD "clientAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD "clientHouse" character varying`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD "clientApartment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP COLUMN "clientApartment"`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP COLUMN "clientHouse"`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP COLUMN "clientAddress"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "house"`);
    }

}
