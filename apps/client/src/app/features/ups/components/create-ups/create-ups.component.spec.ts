import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpsComponent } from './create-ups.component';

describe('CreateUpsComponent', () => {
  let component: CreateUpsComponent;
  let fixture: ComponentFixture<CreateUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
