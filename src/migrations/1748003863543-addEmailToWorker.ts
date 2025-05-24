import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToWorker1748003863543 implements MigrationInterface {
    name = 'AddEmailToWorker1748003863543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "UQ_87f2092ffaae628ef63547d2442" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "workers" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "isEmailConfirmed"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "UQ_87f2092ffaae628ef63547d2442"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "email"`);
    }

}
