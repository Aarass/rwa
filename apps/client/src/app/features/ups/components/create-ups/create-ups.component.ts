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
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Closable } from '../../../global/services/my-dialog/my-dialog.service';
import { SportDto } from '@rwa/shared';
import { SliderModule } from 'primeng/slider';
import { Store } from '@ngrx/store';
import { upsFeature } from '../../store/ups.feature';
import { Subject, takeUntil } from 'rxjs';
import { createUps } from '../../store/ups.actions';
import { RatingModule } from 'primeng/rating';

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
export class CreateUpsComponent implements OnInit, OnDestroy, Closable {
  @Output()
  close = new EventEmitter<void>();
  death = new Subject<void>();

  loading = false;

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

    this.loading = true;

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
