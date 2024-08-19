import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAppointmentsListComponent } from './my-appointments-list.component';

describe('MyAppointmentsListComponent', () => {
  let component: MyAppointmentsListComponent;
  let fixture: ComponentFixture<MyAppointmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppointmentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
