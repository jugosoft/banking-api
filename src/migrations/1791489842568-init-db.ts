import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1791489842568 implements MigrationInterface {
    name = 'InitDb1791489842568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deposit_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_9f6d3e2a90c3163b586b6edda18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deposit_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "depositGroupId" integer, CONSTRAINT "PK_c88efc55015e90abd20280233f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invest_snapshot" ("id" SERIAL NOT NULL, "amount" numeric(15,2) NOT NULL, "date" TIMESTAMP NOT NULL, "investId" integer NOT NULL, CONSTRAINT "PK_8f24ba994273cb5b9053babba91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invest" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "name" character varying, "description" character varying, "archived" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "bankId" integer, "depositTypeId" integer, "startDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f5a6fd6034ae75242c2825f2d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0a439d0e3f81fcdd75af8e8706" ON "invest" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39711f9210d6277cbcacbe0eaa" ON "invest" ("bankId") `);
        await queryRunner.query(`CREATE TABLE "bank" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "shortName" character varying NOT NULL, CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deposit" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "percent" numeric(10,4) NOT NULL, "name" character varying, "description" character varying, "capitalization" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "bankId" integer, "depositTypeId" integer, "startDate" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3f1383d11c01f2b6e63c37575" ON "deposit" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a48d9486b3557c0d5a6709bbe1" ON "deposit" ("bankId") `);
        await queryRunner.query(`CREATE INDEX "IDX_95b69a7b8795c428c00f6241d4" ON "deposit" ("startDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c07d2276142b673b903ad2f3a" ON "deposit" ("endDate") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "hashedRT" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_roles_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON "users_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "deposit_type" ADD CONSTRAINT "FK_6ca1b88345cf77cf9568713f798" FOREIGN KEY ("depositGroupId") REFERENCES "deposit_group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest_snapshot" ADD CONSTRAINT "FK_c4103128bf7d637ba6e0bade598" FOREIGN KEY ("investId") REFERENCES "invest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest" ADD CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest" ADD CONSTRAINT "FK_39711f9210d6277cbcacbe0eaad" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest" ADD CONSTRAINT "FK_b4cbcc17ea67b9adede336bb8c9" FOREIGN KEY ("depositTypeId") REFERENCES "deposit_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_a48d9486b3557c0d5a6709bbe14" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_cf6eb3c704eb28168afe9174950" FOREIGN KEY ("depositTypeId") REFERENCES "deposit_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_b2f0366aa9349789527e0c36d97"`);
        await queryRunner.query(`ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_df951a64f09865171d2d7a502b1"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_cf6eb3c704eb28168afe9174950"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_a48d9486b3557c0d5a6709bbe14"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b"`);
        await queryRunner.query(`ALTER TABLE "invest" DROP CONSTRAINT "FK_b4cbcc17ea67b9adede336bb8c9"`);
        await queryRunner.query(`ALTER TABLE "invest" DROP CONSTRAINT "FK_39711f9210d6277cbcacbe0eaad"`);
        await queryRunner.query(`ALTER TABLE "invest" DROP CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060"`);
        await queryRunner.query(`ALTER TABLE "invest_snapshot" DROP CONSTRAINT "FK_c4103128bf7d637ba6e0bade598"`);
        await queryRunner.query(`ALTER TABLE "deposit_type" DROP CONSTRAINT "FK_6ca1b88345cf77cf9568713f798"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2f0366aa9349789527e0c36d9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df951a64f09865171d2d7a502b"`);
        await queryRunner.query(`DROP TABLE "users_roles_roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c07d2276142b673b903ad2f3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95b69a7b8795c428c00f6241d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a48d9486b3557c0d5a6709bbe1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3f1383d11c01f2b6e63c37575"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39711f9210d6277cbcacbe0eaa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a439d0e3f81fcdd75af8e8706"`);
        await queryRunner.query(`DROP TABLE "invest"`);
        await queryRunner.query(`DROP TABLE "invest_snapshot"`);
        await queryRunner.query(`DROP TABLE "deposit_type"`);
        await queryRunner.query(`DROP TABLE "deposit_group"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
