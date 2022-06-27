import {
  LendingFacade,
  PlaceOnHoldCommand,
} from '@library/lending/application';
import { BookId, PatronId } from '@library/lending/domain';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { fromNullable, of } from 'fp-ts/Option';
import { CancelHoldCommand } from '@library/lending/application';
import { PlaceOnHoldDto } from './dtos/place-on-hold.dto';

@Controller('profiles')
export class PatronProfileController {
  constructor(private readonly lendingFacade: LendingFacade) {}

  @Post(':patronId/holds')
  placeHold(
    @Param('patronId', ParseUUIDPipe) patronId: string,
    @Body() body: PlaceOnHoldDto
  ) {
    return this.lendingFacade.placeOnHold(
      new PlaceOnHoldCommand(
        new PatronId(patronId),
        new BookId(body.bookId),
        fromNullable(body.numberOfDays)
      )
    );
  }

  @HttpCode(204)
  @Delete(':patronId/holds/:bookId')
  cancelHold(
    @Param('patronId', ParseUUIDPipe) patronId: string,
    @Param('bookId', ParseUUIDPipe) bookId: string
  ) {
    return this.lendingFacade.cancelHold(
      new CancelHoldCommand(new PatronId(patronId), new BookId(bookId))
    );
  }
}
