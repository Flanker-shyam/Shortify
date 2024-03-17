import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1710655138022 implements MigrationInterface {
    name = 'Migrations1710655138022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_entity" DROP CONSTRAINT "FK_0023da8be2bfdc30b47fad02e16"`);
        await queryRunner.query(`ALTER TABLE "url_entity" RENAME COLUMN "userIdId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "url_entity" ADD CONSTRAINT "FK_a07f9a4be25fdb0a2a43a63d3cf" FOREIGN KEY ("userId") REFERENCES "auth_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_entity" DROP CONSTRAINT "FK_a07f9a4be25fdb0a2a43a63d3cf"`);
        await queryRunner.query(`ALTER TABLE "url_entity" RENAME COLUMN "userId" TO "userIdId"`);
        await queryRunner.query(`ALTER TABLE "url_entity" ADD CONSTRAINT "FK_0023da8be2bfdc30b47fad02e16" FOREIGN KEY ("userIdId") REFERENCES "auth_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
