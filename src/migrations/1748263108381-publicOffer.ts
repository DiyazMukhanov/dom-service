import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicOffer1748263108381 implements MigrationInterface {
    name = 'PublicOffer1748263108381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public_offer" ("id" SERIAL NOT NULL, "version" character varying NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_00d48b2f074082edff915c3662c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "offerAcceptedAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "acceptedOfferVersion" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "acceptedOfferContent" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "acceptedOfferHash" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "acceptedOfferHash"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "acceptedOfferContent"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "acceptedOfferVersion"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "offerAcceptedAt"`);
        await queryRunner.query(`DROP TABLE "public_offer"`);
    }

}
