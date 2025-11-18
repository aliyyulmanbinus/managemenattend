import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSettings } from './schedule-settings';

describe('ScheduleSettings', () => {
  let component: ScheduleSettings;
  let fixture: ComponentFixture<ScheduleSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
