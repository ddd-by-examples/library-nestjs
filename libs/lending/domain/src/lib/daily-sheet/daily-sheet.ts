import { BookHoldCanceled } from "../events/book-hold-canceling-failed";
import { BookHoldExpired } from "../events/book-hold.expired";
import { BookPlacedOnHold } from "../events/book-placed-on-hold";
import { CheckoutsToOverdueSheet } from "./checkouts-to-overdue-sheet";
import { HoldsToExpireSheet } from "./holds-to-expire-sheet";

export interface DailySheet {

    queryForCheckoutsToOverdue(): Promise<CheckoutsToOverdueSheet>

    queryForHoldsToExpireSheet(): Promise<HoldsToExpireSheet>;

    handleBookPlacedOnHold(event: BookPlacedOnHold): Promise<void>;

    handle( event: BookHoldCanceled): Promise<void>;

    handle( event: BookHoldExpired): Promise<void>;

}