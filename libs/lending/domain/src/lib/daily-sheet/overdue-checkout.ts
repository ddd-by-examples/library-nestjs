import { TinyType } from "tiny-types";
import { BookId } from "../value-objects/book-id";
import { LibraryBranchId } from "../value-objects/library-branch-id";
import { PatronId } from "../value-objects/patron-id";
import { OverdueCheckoutRegistered } from '../events/overdue-checkout-registered'

export class OverdueCheckout extends TinyType {
    constructor(private readonly checkedOutBook: BookId,
    private readonly patron: PatronId,
    private readonly library: LibraryBranchId) {
        super();
    }

    toEvent(): OverdueCheckoutRegistered  {
        return OverdueCheckoutRegistered.now(this.patron, this.checkedOutBook, this.library);
    }
}
