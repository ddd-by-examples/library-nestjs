import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PlaceOnHoldCommand } from '..';

@Injectable()
export class LendingFacade {
  constructor(private readonly commandBus: CommandBus) {}
  placeOnHold(command: PlaceOnHoldCommand): Promise<void> {
    return this.commandBus.execute(command);
  }
}
