/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingEventTypes1730056789000 implements MigrationInterface {
  name = 'AddMissingEventTypes1730056789000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "public"."events_analytics_event_type_enum" ADD VALUE IF NOT EXISTS 'RequestCancelled';
    `);
    await queryRunner.query(`
      ALTER TYPE "public"."events_analytics_event_type_enum" ADD VALUE IF NOT EXISTS 'RequestInTransit';
    `);
    await queryRunner.query(`
      ALTER TYPE "public"."events_analytics_event_type_enum" ADD VALUE IF NOT EXISTS 'RequestCompleted';
    `);
    await queryRunner.query(`
      ALTER TYPE "public"."events_analytics_event_type_enum" ADD VALUE IF NOT EXISTS 'RequestExpired';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ⚠️ PostgreSQL no permite eliminar valores de un ENUM directamente.
    // Si alguna vez necesitás revertir, deberás recrear el tipo manualmente.
  }
}
