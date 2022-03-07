import { LendingModule } from '@library/lending/infrastructure';
import { Module } from '@nestjs/common';
import { PatronProfileController } from './patron-profile.controller';

@Module({
  imports: [LendingModule],
  controllers: [PatronProfileController],
})
export class PatronProfileModule {}
