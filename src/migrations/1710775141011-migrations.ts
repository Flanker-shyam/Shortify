import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1710775141011 implements MigrationInterface {
    name = 'Migrations1710775141011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_entity" RENAME COLUMN "createAt" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "auth_entity" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "auth_entity" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "auth_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "auth_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_entity" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "auth_entity" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "auth_entity" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "auth_entity" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "url_entity" RENAME COLUMN "createdAt" TO "createAt"`);
    }

}
