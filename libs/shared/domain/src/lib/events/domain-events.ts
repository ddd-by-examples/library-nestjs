import { DomainEvent } from './domain.event';

export abstract class DomainEvents {
  abstract publish(event: DomainEvent): void;
}
