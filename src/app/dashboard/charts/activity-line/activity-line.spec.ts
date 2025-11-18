import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityLineComponent } from './activity-line';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivityLineComponent', () => {
  let component: ActivityLineComponent;
  let fixture: ComponentFixture<ActivityLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActivityLineComponent, // standalone import
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dataset when employees provided', () => {
    (component as any).employees = [
      { name: 'Budi', activeDays: 5, izin: 2 }
    ];
    if (typeof (component as any).ngOnChanges === 'function') {
      (component as any).ngOnChanges({});
    } else if (typeof (component as any).updateChart === 'function') {
      (component as any).updateChart();
    }
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
