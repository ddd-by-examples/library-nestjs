import { Test } from '@nestjs/testing';
import { LendingApplicationService } from './lending-application.service';

describe('LendingApplicationService', () => {
  let service: LendingApplicationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LendingApplicationService],
    }).compile();

    service = module.get(LendingApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
