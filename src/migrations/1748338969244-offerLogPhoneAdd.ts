import { MigrationInterface, QueryRunner } from "typeorm";

export class OfferLogPhoneAdd1748338969244 implements MigrationInterface {
    name = 'OfferLogPhoneAdd1748338969244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD "clientEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD "clientPhone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP COLUMN "clientPhone"`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP COLUMN "clientEmail"`);
    }

}
