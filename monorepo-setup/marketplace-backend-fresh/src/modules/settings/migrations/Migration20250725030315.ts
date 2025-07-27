import { Migration } from '@mikro-orm/migrations';

export class Migration20250725030315 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "settings" drop constraint if exists "settings_key_unique";`);
    this.addSql(`create table if not exists "settings" ("id" text not null, "key" text not null, "value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_settings_key_unique" ON "settings" (key) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_settings_deleted_at" ON "settings" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "settings" cascade;`);
  }

}
