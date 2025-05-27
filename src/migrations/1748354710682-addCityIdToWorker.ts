import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCityIdToWorker1748354710682 implements MigrationInterface {
    name = 'AddCityIdToWorker1748354710682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "workers" ADD "city_id" integer`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "FK_0f9d43405f5fc67702ac6d71235" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "FK_0f9d43405f5fc67702ac6d71235"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "cityId"`);
    }

}
