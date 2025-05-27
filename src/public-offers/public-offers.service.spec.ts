import { Test, TestingModule } from '@nestjs/testing';
import { PublicOffersService } from './public-offers.service';

describe('PublicOffersService', () => {
  let service: PublicOffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicOffersService],
    }).compile();

    service = module.get<PublicOffersService>(PublicOffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
