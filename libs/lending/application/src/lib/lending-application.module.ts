import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookPlacedOnHoldEventHandler } from './book-placed-on-hold.event-handler';
import { CancelHoldHandler } from './cancel-hold/cancel-hold.handler';
import { CheckOutBookHandler } from './check-out/check-out-book.handler';
import { LendingFacade } from './lending.facade';
import { PlaceOnHoldHandler } from './place-on-hold/place-on-hold.handler';
import { DuplicateHoldEventHandler } from './duplicate-hold.event.handler';
import { BookHoldCanceledEventHandler } from './book-hold-canceled.event-handler';
import { CreateAvailableBookOnInstanceAddedEventHandler } from './create-available-book-on-instance-added.event-handler';

@Module({
  imports: [CqrsModule],
  providers: [
    BookHoldCanceledEventHandler,
    BookPlacedOnHoldEventHandler,
    CancelHoldHandler,
    CheckOutBookHandler,
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
