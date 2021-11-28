import { Module } from '@nestjs/common';
import { LendingApplicationModule } from '@library/lending/application';
import { LendingInfrastructureModule } from './lending-infrastructure.module';

@Module({
  imports: [
    LendingApplicationModule.withInfrastructure([LendingInfrastructureModule]),
  ],
  exports: [LendingApplicationModule],
})
export class LendingModule {}
