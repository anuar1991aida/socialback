import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758538944747 implements MigrationInterface {
    name = 'InitialMigration1758538944747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "account_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "account_id"`);
    }

}
