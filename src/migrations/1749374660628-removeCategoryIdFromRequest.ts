import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCategoryIdFromRequest1749374660628 implements MigrationInterface {
    name = 'RemoveCategoryIdFromRequest1749374660628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" DROP CONSTRAINT "FK_27c81713a0587e64f26cd10f34e"`);
        await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "category_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_requests" ADD "category_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_requests" ADD CONSTRAINT "FK_27c81713a0587e64f26cd10f34e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
