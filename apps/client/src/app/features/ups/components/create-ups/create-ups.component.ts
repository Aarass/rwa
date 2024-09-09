import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { SportDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { Subject, takeUntil } from 'rxjs';
import { createUps } from '../../store/ups.actions';
import { upsFeature } from '../../store/ups.feature';

@Component({
  selector: 'app-create-ups',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DropdownModule,
    InputTextModule,
    SliderModule,
    RatingModule,
  ],
  templateUrl: './create-ups.component.html',
  styleUrl: './create-ups.component.scss',
})
export class CreateUpsComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  @Output()
  close = new EventEmitter<void>();

  isLoading = false;

  sports: SportDto[] = [];

  formGroup = new FormGroup({
    selectedSportControl: new FormControl<SportDto | null>(null, [
      Validators.required,
    ]),
    skillLevelControl: new FormControl<number>(3, [Validators.required]),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(upsFeature.selectSportsIDontPlay)
      .pipe(takeUntil(this.death))
      .subscribe((sports) => {
        this.sports = sports;
      });

    this.store
      .select(upsFeature.selectIsLoading)
      .pipe(takeUntil(this.death))
      .subscribe((newIsLoading) => {
        if (this.isLoading && newIsLoading === false) {
          this.isLoading = false;
          this.close.emit();
        }
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  cancel() {
    this.close.emit();
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }

    // console.log({
    //   sportId: this.formGroup.controls.selectedSportControl.value!.id,
    //   selfRatedSkillLevel: this.formGroup.controls.skillLevelControl.value!,
    // });
    // return;

    this.isLoading = true;

    this.store.dispatch(
      createUps({
        data: {
          sportId: this.formGroup.controls.selectedSportControl.value!.id,
          selfRatedSkillLevel: this.formGroup.controls.skillLevelControl.value!,
        },
      })
    );
  }
}
