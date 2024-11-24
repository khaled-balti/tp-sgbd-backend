import { Test, TestingModule } from '@nestjs/testing';
import { LicencePerClientService } from './licence_per_client.service';

describe('LicencePerClientService', () => {
  let service: LicencePerClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicencePerClientService],
    }).compile();

    service = module.get<LicencePerClientService>(LicencePerClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
