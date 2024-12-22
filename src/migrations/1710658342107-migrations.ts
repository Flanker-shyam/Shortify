import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1710658342107 implements MigrationInterface {
  name = 'Migrations1710658342107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_57db63611b67e91ee24e71cfde2" UNIQUE ("username"), CONSTRAINT "PK_d3d458da474344a6982aec36b5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "analytics_entity" ("id" SERIAL NOT NULL, "clickedAtTimeStamp" TIMESTAMP NOT NULL, "userAgent" text NOT NULL, "referralSource" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "urlId" integer, CONSTRAINT "PK_8bdebe7e29915e204f0015f6094" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "url_entity" ("id" SERIAL NOT NULL, "longUrl" text NOT NULL, "shortUrl" text NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_0ec3eb469ff2aed091ff9b2545e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics_entity" ADD CONSTRAINT "FK_62bf9eb6b0e4db3838da321b827" FOREIGN KEY ("urlId") REFERENCES "url_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_entity" ADD CONSTRAINT "FK_a07f9a4be25fdb0a2a43a63d3cf" FOREIGN KEY ("userId") REFERENCES "auth_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url_entity" DROP CONSTRAINT "FK_a07f9a4be25fdb0a2a43a63d3cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics_entity" DROP CONSTRAINT "FK_62bf9eb6b0e4db3838da321b827"`,
    );
    await queryRunner.query(`DROP TABLE "url_entity"`);
    await queryRunner.query(`DROP TABLE "analytics_entity"`);
    await queryRunner.query(`DROP TABLE "auth_entity"`);
  }
}
