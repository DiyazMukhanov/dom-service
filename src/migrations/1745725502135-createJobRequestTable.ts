import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobRequestTable1745725502135 implements MigrationInterface {
    name = 'CreateJobRequestTable1745725502135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job_requests" ("id" SERIAL NOT NULL, "workType" character varying NOT NULL, "workDescription" character varying NOT NULL, "workDate" character varying NOT NULL, "workTime" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32ec22ee81def140c506ef8440d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "job_requests"`);
    }

}
