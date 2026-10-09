import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1791489305984 implements MigrationInterface {
    name = ' $npmConfigName1791489305984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invest" DROP CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060"`);
        await queryRunner.query(`ALTER TABLE "invest" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b"`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "endDate" DROP DEFAULT`);
        await queryRunner.query(`CREATE INDEX "IDX_0a439d0e3f81fcdd75af8e8706" ON "invest" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39711f9210d6277cbcacbe0eaa" ON "invest" ("bankId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3f1383d11c01f2b6e63c37575" ON "deposit" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a48d9486b3557c0d5a6709bbe1" ON "deposit" ("bankId") `);
        await queryRunner.query(`CREATE INDEX "IDX_95b69a7b8795c428c00f6241d4" ON "deposit" ("startDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c07d2276142b673b903ad2f3a" ON "deposit" ("endDate") `);
        await queryRunner.query(`ALTER TABLE "invest" ADD CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b"`);
        await queryRunner.query(`ALTER TABLE "invest" DROP CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c07d2276142b673b903ad2f3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95b69a7b8795c428c00f6241d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a48d9486b3557c0d5a6709bbe1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3f1383d11c01f2b6e63c37575"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39711f9210d6277cbcacbe0eaa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a439d0e3f81fcdd75af8e8706"`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "endDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invest" ADD CONSTRAINT "FK_0a439d0e3f81fcdd75af8e87060" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
