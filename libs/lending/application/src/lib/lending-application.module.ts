import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookPlacedOnHoldEventHandler } from './book-placed-on-hold.event-handler';
import { CancelHoldHandler } from './cancel-hold/cancel-hold.handler';
import { LendingFacade } from './lending.facade';
import { PlaceOnHoldHandler } from './place-on-hold/placing-on-hold';
import { DuplicateHoldEventHandler } from './duplicate-hold.event.handler';
import { BookHoldCanceledEventHandler } from './book-hold-canceled.event-handler';
import { CreateAvailableBookOnInstanceAddedEventHandler } from './create-available-book-on-instance-added.event-handler';

@Module({
  imports: [CqrsModule],
  providers: [
    BookHoldCanceledEventHandler,
    BookPlacedOnHoldEventHandler,
    CancelHoldHandler,
    CreateAvailableBookOnInstanceAddedEventHandler,
    DuplicateHoldEventHandler,
    LendingFacade,
    PlaceOnHoldHandler,
  ],
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
