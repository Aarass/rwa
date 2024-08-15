import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpsListComponent } from './ups-list.component';

describe('UpsListComponent', () => {
  let component: UpsListComponent;
  let fixture: ComponentFixture<UpsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
