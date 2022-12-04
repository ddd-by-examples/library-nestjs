import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      host: process.env.DB_HOST,
      port: 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
      autoLoadEntities: true,
      type: 'postgresql',
      allowGlobalContext: true,
    }),
  ],
})
export class TestingMikroOrmModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}
  async onModuleInit(): Promise<void> {
    await this.orm.schema.dropSchema();
    await this.orm.schema.updateSchema();
  }
}
