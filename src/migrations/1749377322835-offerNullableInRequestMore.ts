import { MigrationInterface, QueryRunner } from "typeorm";

export class OfferNullableInRequestMore1749377322835 implements MigrationInterface {
    name = 'OfferNullableInRequestMore1749377322835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "acceptedOfferContent"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "acceptedOfferContent" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "acceptedOfferContent"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "acceptedOfferContent" text NOT NULL`);
    }

}
