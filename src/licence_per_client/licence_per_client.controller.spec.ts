import { Test, TestingModule } from '@nestjs/testing';
import { LicencePerClientController } from './licence_per_client.controller';
import { LicencePerClientService } from './licence_per_client.service';

describe('LicencePerClientController', () => {
  let controller: LicencePerClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicencePerClientController],
      providers: [LicencePerClientService],
    }).compile();

    controller = module.get<LicencePerClientController>(LicencePerClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
