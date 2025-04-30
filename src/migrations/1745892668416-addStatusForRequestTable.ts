import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusForRequestTable1745892668416 implements MigrationInterface {
    name = 'AddStatusForRequestTable1745892668416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."job_requests_status_enum" AS ENUM('opened', 'closed')`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "status" "public"."job_requests_status_enum" NOT NULL DEFAULT 'opened'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."job_requests_status_enum"`);
    }

}
