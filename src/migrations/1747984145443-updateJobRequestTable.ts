import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobRequestTable1747984145443 implements MigrationInterface {
    name = 'UpdateJobRequestTable1747984145443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "workType"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "workDescription"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "comments" character varying`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "occupation_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "category_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "booked_by" integer`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "city_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."job_requests_status_enum" RENAME TO "job_requests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_requests_status_enum" AS ENUM('opened', 'booked', 'closed')`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" TYPE "public"."job_requests_status_enum" USING "status"::"text"::"public"."job_requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" SET DEFAULT 'opened'`);
        await queryRunner.query(`DROP TYPE "public"."job_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD CONSTRAINT "FK_93cc02495917f62f1b1c407bbff" FOREIGN KEY ("occupation_id") REFERENCES "occupations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD CONSTRAINT "FK_27c81713a0587e64f26cd10f34e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD CONSTRAINT "FK_87fd27b908cccc903661d6cd77a" FOREIGN KEY ("booked_by") REFERENCES "workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD CONSTRAINT "FK_c78361cb3a7fe960b3f4467dacc" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP CONSTRAINT "FK_c78361cb3a7fe960b3f4467dacc"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP CONSTRAINT "FK_87fd27b908cccc903661d6cd77a"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP CONSTRAINT "FK_27c81713a0587e64f26cd10f34e"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP CONSTRAINT "FK_93cc02495917f62f1b1c407bbff"`);
        await queryRunner.query(`CREATE TYPE "public"."job_requests_status_enum_old" AS ENUM('opened', 'closed')`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" TYPE "public"."job_requests_status_enum_old" USING "status"::"text"::"public"."job_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "status" SET DEFAULT 'opened'`);
        await queryRunner.query(`DROP TYPE "public"."job_requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_requests_status_enum_old" RENAME TO "job_requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "booked_by"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "occupation_id"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "workDescription" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "workType" character varying NOT NULL`);
    }

}
