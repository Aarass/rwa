import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSurfaceComponent } from './create-surface.component';

describe('CreateSurfaceComponent', () => {
  let component: CreateSurfaceComponent;
  let fixture: ComponentFixture<CreateSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSurfaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
