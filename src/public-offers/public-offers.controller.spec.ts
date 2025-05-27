import { Test, TestingModule } from '@nestjs/testing';
import { PublicOffersController } from './public-offers.controller';

describe('PublicOffersController', () => {
  let controller: PublicOffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicOffersController],
    }).compile();

    controller = module.get<PublicOffersController>(PublicOffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
