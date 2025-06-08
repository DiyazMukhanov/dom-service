import { MigrationInterface, QueryRunner } from "typeorm";

export class OfferNullableInRequest1749377184105 implements MigrationInterface {
    name = 'OfferNullableInRequest1749377184105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "offerAcceptedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "acceptedOfferVersion" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "acceptedOfferHash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "acceptedOfferHash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "acceptedOfferVersion" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "offerAcceptedAt" SET NOT NULL`);
    }

}
