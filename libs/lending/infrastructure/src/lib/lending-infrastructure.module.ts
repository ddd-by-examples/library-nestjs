import { Module } from '@nestjs/common';
import { LendingTypeOrmModule } from './typeorm/lending-typeorm.module';

@Module({
  imports: [LendingTypeOrmModule],
  exports: [LendingTypeOrmModule],
})
export class LendingInfrastructureModule {}
