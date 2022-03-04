import { LendingApplicationModule } from '@library/lending/application';
import { Module } from '@nestjs/common';
import { PatronProfileController } from './patron-profile.controller';

@Module({
  imports: [LendingApplicationModule.withInfrastructure([])],
  controllers: [PatronProfileController],
})
export class PatronProfileModule {}
