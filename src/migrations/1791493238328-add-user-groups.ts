import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserGroups1791493238328 implements MigrationInterface {
    name = 'AddUserGroups1791493238328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Добавляем поля ФИО в таблицу users
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "patronymic" character varying DEFAULT NULL`);

        // Создаём таблицу групп пользователей
        await queryRunner.query(`CREATE TABLE "deposit_user_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ownerId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e2243f89b42c1b5e1a3c5d6f7a7" PRIMARY KEY ("id"))`);

        // Добавляем groupId в таблицу users
        await queryRunner.query(`ALTER TABLE "users" ADD "groupId" integer DEFAULT NULL`);

        // Создаём индекс на groupId
        await queryRunner.query(`CREATE INDEX "IDX_users_groupId" ON "users" ("groupId") `);

        // Добавляем внешний ключ на ownerId в deposit_user_group
        await queryRunner.query(`ALTER TABLE "deposit_user_group" ADD CONSTRAINT "FK_ownerId" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        // Добавляем внешний ключ на groupId в users
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_groupId" FOREIGN KEY ("groupId") REFERENCES "deposit_user_group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем внешние ключи
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_groupId"`);
        await queryRunner.query(`ALTER TABLE "deposit_user_group" DROP CONSTRAINT "FK_ownerId"`);

        // Удаляем индекс и поле groupId
        await queryRunner.query(`DROP INDEX "public"."IDX_users_groupId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "groupId"`);

        // Удаляем поля ФИО
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "patronymic"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);

        // Удаляем таблицу групп пользователей
        await queryRunner.query(`DROP TABLE "deposit_user_group"`);
    }

}
