import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIpToRequest1748261183680 implements MigrationInterface {
    name = 'AddIpToRequest1748261183680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "offerAccepted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "clientIp" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "clientIp"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "offerAccepted"`);
    }

}
