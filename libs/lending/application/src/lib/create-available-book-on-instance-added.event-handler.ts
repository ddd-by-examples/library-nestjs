import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { BookInstanceAddedToCatalogue } from "@library/catalogue";
import { BookRepository } from "./ports/book.repository";
import { AvailableBook, BookId, LibraryBranchId } from "@library/lending/domain";
import { Version } from "@library/shared/domain";

@EventsHandler(BookInstanceAddedToCatalogue)
export class CreateAvailableBookOnInstanceAddedEventHandler implements IEventHandler<BookInstanceAddedToCatalogue> {
    constructor(private readonly bookRepository: BookRepository) {}
    handle(event: BookInstanceAddedToCatalogue) {
        this.bookRepository.save(new AvailableBook(new BookId(event.bookId.value), this.ourLibraryBranch(), Version.zero()))
    }
    ourLibraryBranch(): LibraryBranchId {
        //from properties
        return LibraryBranchId.generate()
    }

}