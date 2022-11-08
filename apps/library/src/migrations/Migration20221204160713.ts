import { Migration } from '@mikro-orm/migrations';

export class Migration20221204160713 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book" ("isbn" varchar(100) not null, "author" varchar(100) not null, "title" varchar(100) not null, constraint "book_pkey" primary key ("isbn"));'
    );

    this.addSql(
      'create table "book_instance" ("book_id" varchar(255) not null, "isbn" varchar(100) not null, "book_type" smallint not null, constraint "book_instance_pkey" primary key ("book_id"));'
    );
  }
}
