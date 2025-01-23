import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTrackerComponent } from './device-tracker.component';

describe('DeviceTrackerComponent', () => {
  let component: DeviceTrackerComponent;
  let fixture: ComponentFixture<DeviceTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
