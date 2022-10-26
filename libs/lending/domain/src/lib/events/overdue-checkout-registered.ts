import { Uuid } from "@library/shared/domain";
import { BookId } from "../value-objects/book-id";
import { DateVO } from "../value-objects/date.vo";
import { LibraryBranchId } from "../value-objects/library-branch-id";
import { PatronId } from "../value-objects/patron-id";
import { PatronEvent } from "./patron-event";

export class OverdueCheckoutRegistered implements PatronEvent {
    public readonly eventId = Uuid.generate();

    constructor(public readonly when: DateVO,public readonly patronId: Uuid,public readonly bookId: Uuid, public readonly libraryBranchId: Uuid) {}

    public static now( patronId: PatronId,  bookId: BookId,  libraryBranchId: LibraryBranchId): OverdueCheckoutRegistered {
        return new OverdueCheckoutRegistered(
                DateVO.now(),
                patronId,
                bookId,
                libraryBranchId)
    }
}

