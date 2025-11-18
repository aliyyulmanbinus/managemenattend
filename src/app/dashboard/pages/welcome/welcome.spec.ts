import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

// NgZorro stubs/imports optional: gunakan NO_ERRORS_SCHEMA jika banyak dependensi
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        WelcomeComponent,
        HttpClientTestingModule
      ],

      providers: [ provideAnimations() ],
      schemas: [ NO_ERRORS_SCHEMA ] 
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
