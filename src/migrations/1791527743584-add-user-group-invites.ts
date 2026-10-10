import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserGroupInvites1791527743584 implements MigrationInterface {
    name = 'AddUserGroupInvites1791527743584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаём таблицу приглашений в группы пользователей
        await queryRunner.query(`CREATE TABLE "user_group_invites" ("id" SERIAL NOT NULL, "groupId" integer NOT NULL, "inviterId" integer NOT NULL, "inviteeUsername" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c92a3b4d5e6f7a8b9c0d1e2f3a" PRIMARY KEY ("id"))`);

        // Создаём индекс на inviteeUsername для быстрого поиска
        await queryRunner.query(`CREATE INDEX "IDX_user_group_invites_inviteeUsername" ON "user_group_invites" ("inviteeUsername") `);

        // Создаём индекс на inviterId
        await queryRunner.query(`CREATE INDEX "IDX_user_group_invites_inviterId" ON "user_group_invites" ("inviterId") `);

        // Добавляем внешний ключ на groupId
        await queryRunner.query(`ALTER TABLE "user_group_invites" ADD CONSTRAINT "FK_user_group_invites_groupId" FOREIGN KEY ("groupId") REFERENCES "deposit_user_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Добавляем внешний ключ на inviterId
        await queryRunner.query(`ALTER TABLE "user_group_invites" ADD CONSTRAINT "FK_user_group_invites_inviterId" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем внешние ключи
        await queryRunner.query(`ALTER TABLE "user_group_invites" DROP CONSTRAINT "FK_user_group_invites_inviterId"`);
        await queryRunner.query(`ALTER TABLE "user_group_invites" DROP CONSTRAINT "FK_user_group_invites_groupId"`);

        // Удаляем индексы
        await queryRunner.query(`DROP INDEX "public"."IDX_user_group_invites_inviterId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_group_invites_inviteeUsername"`);

        // Удаляем таблицу
        await queryRunner.query(`DROP TABLE "user_group_invites"`);
    }

}
