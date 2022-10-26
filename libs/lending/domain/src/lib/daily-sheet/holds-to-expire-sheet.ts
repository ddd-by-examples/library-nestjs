import { TinyType } from "tiny-types";
import { ExpiredHold } from "./expired-hold";

export class HoldsToExpireSheet extends TinyType {

    constructor(private readonly expiredHolds: ExpiredHold[]) {
        super()
    }
}
