import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriesTable1747980716767 implements MigrationInterface {
    name = 'AddCategoriesTable1747980716767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" double precision NOT NULL, "occupation_id" integer, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_ce8e5cb4b7ca4fe38a672be8d65" FOREIGN KEY ("occupation_id") REFERENCES "occupations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_ce8e5cb4b7ca4fe38a672be8d65"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
