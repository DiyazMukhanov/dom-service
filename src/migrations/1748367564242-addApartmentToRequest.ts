import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApartmentToRequest1748367564242 implements MigrationInterface {
    name = 'AddApartmentToRequest1748367564242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "apartment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "apartment"`);
    }

}
