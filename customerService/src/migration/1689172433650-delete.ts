import { MigrationInterface, QueryRunner } from "typeorm"

export class Delete1689172433650 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('GRANT DELETE ON wishlist TO postgres;');
        await queryRunner.query("ALTER TABLE customers ALTER COLUMN mobile_number TYPE bigint");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('REVOKE DELETE ON wishlist FROM postgres;');
    }

}
