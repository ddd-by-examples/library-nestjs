import { CatalogueModule } from '@library/catalogue';
import { LendingUiRestModule } from '@library/lending/ui-rest';
import { Module } from '@nestjs/common';
import { AppCoreModule } from './app-core.module';

@Module({
  imports: [AppCoreModule, CatalogueModule, LendingUiRestModule],
})
export class AppModule {}
