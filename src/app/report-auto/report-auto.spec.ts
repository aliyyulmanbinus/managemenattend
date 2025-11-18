import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAuto } from './report-auto';

describe('ReportAuto', () => {
  let component: ReportAuto;
  let fixture: ComponentFixture<ReportAuto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAuto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAuto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
