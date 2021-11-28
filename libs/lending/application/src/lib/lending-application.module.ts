import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { LendingApplicationService } from './lending-application.service';

@Module({
  providers: [LendingApplicationService],
  exports: [LendingApplicationService],
})
export class LendingApplicationModule {
  static withInfrastructure(
    infrastructure: ModuleMetadata['imports']
  ): DynamicModule {
    infrastructure = infrastructure ?? [];
    return {
      module: LendingApplicationModule,
      imports: [...infrastructure],
      providers: [],
    };
  }
}
