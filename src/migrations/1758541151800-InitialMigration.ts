import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758541151800 implements MigrationInterface {
    name = 'InitialMigration1758541151800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_fa8a79c421ca4b9bcdb9f5871a5"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "accountsId" TO "accounts_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_b483ab0cb65e2cddfb14dcbc430" FOREIGN KEY ("accounts_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_b483ab0cb65e2cddfb14dcbc430"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "accounts_id" TO "accountsId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_fa8a79c421ca4b9bcdb9f5871a5" FOREIGN KEY ("accountsId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
