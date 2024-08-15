import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpsListItemComponent } from './ups-list-item.component';

describe('UpsListItemComponent', () => {
  let component: UpsListItemComponent;
  let fixture: ComponentFixture<UpsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
