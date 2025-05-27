import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkerEmailNotUnique1748351161088 implements MigrationInterface {
    name = 'WorkerEmailNotUnique1748351161088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "UQ_87f2092ffaae628ef63547d2442"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "UQ_87f2092ffaae628ef63547d2442" UNIQUE ("email")`);
    }

}
