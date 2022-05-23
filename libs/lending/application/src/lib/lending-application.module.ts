import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CancelHoldHandler } from './cancel-hold/cancel-hold.handler';
import { LendingFacade } from './lending.facade';
import { PlaceOnHoldHandler } from './place-on-hold/place-on-hold.handler';

@Module({
  imports: [CqrsModule],
  providers: [LendingFacade, PlaceOnHoldHandler, CancelHoldHandler],
  exports: [LendingFacade],
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
