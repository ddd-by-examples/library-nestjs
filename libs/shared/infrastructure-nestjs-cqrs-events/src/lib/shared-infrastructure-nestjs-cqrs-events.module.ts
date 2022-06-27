import { DomainEvents } from '@library/shared/domain';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NestJSCqrsDomainEvents } from './nestjs-cqrs-domain-events';

@Module({
  imports: [CqrsModule],
  providers: [
    NestJSCqrsDomainEvents,
    { provide: DomainEvents, useExisting: NestJSCqrsDomainEvents },
  ],
  exports: [DomainEvents],
})
export class SharedInfrastructureNestjsCqrsEventsModule {}
