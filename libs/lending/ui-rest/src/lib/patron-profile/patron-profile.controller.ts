import {
  LendingFacade,
  PlaceOnHoldCommand,
} from '@library/lending/application';
import { BookId, PatronId } from '@library/lending/domain';
import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { of } from 'fp-ts/Option';
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
        of(body.numberOfDays)
      )
    );
  }
}
