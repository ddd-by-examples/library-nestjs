import { Module } from '@nestjs/common';
import { PatronProfileModule } from './patron-profile/patron-profile.module';

@Module({
  imports: [PatronProfileModule],
})
export class LendingUiRestModule {}
