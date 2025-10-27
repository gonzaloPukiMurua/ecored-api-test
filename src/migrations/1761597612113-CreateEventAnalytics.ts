import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventAnalytics1761597612113 implements MigrationInterface {
    name = 'CreateEventAnalytics1761597612113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "publisher_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."requests_status_enum" RENAME TO "requests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'cancelled', 'in_transit', 'completed', 'expired')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" TYPE "public"."requests_status_enum" USING "status"::"text"::"public"."requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."listings_status_enum" RENAME TO "listings_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum" AS ENUM('draft', 'published', 'reserved', 'committed', 'in_transit', 'delivered', 'paused', 'cancelled', 'blocked', 'expired')`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" TYPE "public"."listings_status_enum" USING "status"::"text"::"public"."listings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_39cf29a6cd31f4b23dc91c35a1f" FOREIGN KEY ("publisher_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_39cf29a6cd31f4b23dc91c35a1f"`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum_old" AS ENUM('draft', 'published', 'blocked', 'delivered')`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" TYPE "public"."listings_status_enum_old" USING "status"::"text"::"public"."listings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."listings_status_enum_old" RENAME TO "listings_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum_old" AS ENUM('pending', 'accepted', 'rejected', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" TYPE "public"."requests_status_enum_old" USING "status"::"text"::"public"."requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."requests_status_enum_old" RENAME TO "requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "publisher_id"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "active"`);
    }

}
