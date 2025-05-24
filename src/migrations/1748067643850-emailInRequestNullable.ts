import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailInRequestNullable1748067643850 implements MigrationInterface {
    name = 'EmailInRequestNullable1748067643850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "email" SET NOT NULL`);
    }

}
