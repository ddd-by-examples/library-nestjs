import { BookDuplicateHoldFound } from '@library/lending/domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CancelHoldCommand } from './cancel-hold/cancel-hold.command';
import { CancelHoldHandler } from './cancel-hold/cancel-hold.handler';

@EventsHandler(BookDuplicateHoldFound)
export class DuplicateHoldEventHandler
  implements IEventHandler<BookDuplicateHoldFound>
{
  constructor(private readonly cancelHold: CancelHoldHandler) {}

  handle(event: BookDuplicateHoldFound) {
    return this.cancelHold.execute(this.cancelHoldCommandFromEvent(event));
  }

  cancelHoldCommandFromEvent(event: BookDuplicateHoldFound): CancelHoldCommand {
    return new CancelHoldCommand(event.secondPatronId, event.bookId);
  }
}
