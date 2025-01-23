import { TestBed } from '@angular/core/testing';

import { MqttDataService } from './mqtt-data.service';

describe('MqttDataService', () => {
  let service: MqttDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
