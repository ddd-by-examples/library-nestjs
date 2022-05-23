import { Result } from '@library/shared/domain';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PlaceOnHoldCommand } from '..';
import { CancelHoldCommand } from './cancel-hold/cancel-hold.command';

@Injectable()
export class LendingFacade {
  constructor(private readonly commandBus: CommandBus) {}

  cancelHold(command: CancelHoldCommand): Promise<Result> {
    return this.commandBus.execute(command);
  }

  placeOnHold(command: PlaceOnHoldCommand): Promise<void> {
    return this.commandBus.execute(command);
  }
}
