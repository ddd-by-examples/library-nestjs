import { Module } from '@nestjs/common';
import { LendingApplicationModule } from '@library/lending/application';
import { LendingInfrastructureModule } from './lending-infrastructure.module';
import { SharedInfrastructureNestjsCqrsEventsModule } from '@library/shared/infrastructure-nestjs-cqrs-events';

@Module({
  imports: [
    LendingApplicationModule.withInfrastructure([
      LendingInfrastructureModule,
      SharedInfrastructureNestjsCqrsEventsModule,
    ]),
  ],
  exports: [LendingApplicationModule],
})
export class LendingModule {}
