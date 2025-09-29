import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758540102649 implements MigrationInterface {
    name = 'InitialMigration1758540102649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "account_id" TO "db_acc_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "db_acc_id" TO "account_id"`);
    }

}
