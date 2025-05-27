import { MigrationInterface, QueryRunner } from "typeorm";

export class OfferLog1748329904578 implements MigrationInterface {
    name = 'OfferLog1748329904578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offer_acceptance_log" ("id" SERIAL NOT NULL, "jobRequestId" integer NOT NULL, "offerVersion" character varying NOT NULL, "offerContent" text NOT NULL, "offerHash" character varying NOT NULL, "clientIp" character varying NOT NULL, "acceptedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_58430540c55f0a1a234ec9e95e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" ADD CONSTRAINT "FK_4128bc9238cf681c43176efa7a0" FOREIGN KEY ("jobRequestId") REFERENCES "job_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_acceptance_log" DROP CONSTRAINT "FK_4128bc9238cf681c43176efa7a0"`);
        await queryRunner.query(`DROP TABLE "offer_acceptance_log"`);
    }

}
