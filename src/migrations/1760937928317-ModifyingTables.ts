import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyingTables1760937928317 implements MigrationInterface {
    name = 'ModifyingTables1760937928317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_aec980a0f31c45a32483218eda5"`);
        await queryRunner.query(`ALTER TABLE "events_analytics" DROP CONSTRAINT "FK_7782502f2053b16c6350f7e0532"`);
        await queryRunner.query(`ALTER TABLE "requests" RENAME COLUMN "productProductId" TO "listingListingId"`);
        await queryRunner.query(`ALTER TABLE "events_analytics" RENAME COLUMN "listingProductId" TO "listingListingId"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "zone_text" TO "birthday"`);
        await queryRunner.query(`CREATE TABLE "listing_photo" ("photo_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "listingListingId" uuid, CONSTRAINT "PK_d01c4512336e82da5df84b61dd0" PRIMARY KEY ("photo_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."listings_item_condition_enum" AS ENUM('nuevo', 'como_nuevo', 'usable', 'repuestos')`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum" AS ENUM('draft', 'published', 'blocked', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "listings" ("listing_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "item_condition" "public"."listings_item_condition_enum" NOT NULL, "status" "public"."listings_status_enum" NOT NULL DEFAULT 'draft', "lat" double precision, "lng" double precision, "zone_text" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "ownerUserId" uuid, "categoryCategoryId" uuid NOT NULL, "subcategoryCategoryId" uuid, CONSTRAINT "PK_9cac2c3ec39ee9b17a76fba0047" PRIMARY KEY ("listing_id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "street_number" character varying, "apartment" character varying, "neighborhood" character varying, "city" character varying NOT NULL, "state" character varying, "zip_code" character varying, "country" character varying NOT NULL, "latitude" numeric(10,8), "longitude" numeric(11,8), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_address" ("user_id" uuid NOT NULL, "address_id" uuid NOT NULL, CONSTRAINT "PK_355cdefb5d1a7e44efb77a52519" PRIMARY KEY ("user_id", "address_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29d6df815a78e4c8291d3cf5e5" ON "user_address" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3bdd98c49956021c44c23a48c" ON "user_address" ("address_id") `);
        await queryRunner.query(`ALTER TABLE "categories" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthday" date`);
        await queryRunner.query(`ALTER TABLE "listing_photo" ADD CONSTRAINT "FK_e6f3cfee820ef7aeb6a796ade50" FOREIGN KEY ("listingListingId") REFERENCES "listings"("listing_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_8821b8b846b641c99dbaf39f263" FOREIGN KEY ("listingListingId") REFERENCES "listings"("listing_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_4f1f139a2c6c10da7fbe1e51850" FOREIGN KEY ("ownerUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_a3e283dd791b61013bda39949f3" FOREIGN KEY ("categoryCategoryId") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_0207c2bdfd6fe57170215542dcf" FOREIGN KEY ("subcategoryCategoryId") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events_analytics" ADD CONSTRAINT "FK_cd8a7a32f3a59cd289f9ffc354f" FOREIGN KEY ("listingListingId") REFERENCES "listings"("listing_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_b3bdd98c49956021c44c23a48c4" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_b3bdd98c49956021c44c23a48c4"`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"`);
        await queryRunner.query(`ALTER TABLE "events_analytics" DROP CONSTRAINT "FK_cd8a7a32f3a59cd289f9ffc354f"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_0207c2bdfd6fe57170215542dcf"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_a3e283dd791b61013bda39949f3"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_4f1f139a2c6c10da7fbe1e51850"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_8821b8b846b641c99dbaf39f263"`);
        await queryRunner.query(`ALTER TABLE "listing_photo" DROP CONSTRAINT "FK_e6f3cfee820ef7aeb6a796ade50"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthday" character varying`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3bdd98c49956021c44c23a48c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29d6df815a78e4c8291d3cf5e5"`);
        await queryRunner.query(`DROP TABLE "user_address"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."listings_item_condition_enum"`);
        await queryRunner.query(`DROP TABLE "listing_photo"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birthday" TO "zone_text"`);
        await queryRunner.query(`ALTER TABLE "events_analytics" RENAME COLUMN "listingListingId" TO "listingProductId"`);
        await queryRunner.query(`ALTER TABLE "requests" RENAME COLUMN "listingListingId" TO "productProductId"`);
        await queryRunner.query(`ALTER TABLE "events_analytics" ADD CONSTRAINT "FK_7782502f2053b16c6350f7e0532" FOREIGN KEY ("listingProductId") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_aec980a0f31c45a32483218eda5" FOREIGN KEY ("productProductId") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
