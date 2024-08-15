import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSportComponent } from './create-sport.component';

describe('CreateSportComponent', () => {
  let component: CreateSportComponent;
  let fixture: ComponentFixture<CreateSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
