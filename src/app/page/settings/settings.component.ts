import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {SettingsService} from '../../service/settings.service';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmationPopupComponent} from '../../component/confirmation-popup/confirmation-popup.component';
import {AlertService} from '../../service/alert.service';
import {
  RESET_EVERYTHING_MESSAGE,
  RESET_EVERYTHING_SUCCESS_MESSAGE,
  RESET_SCORES_MESSAGE,
  RESET_SCORES_SUCCESS_MESSAGE
} from '../../constants/constants';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { YesNoDropdownComponent } from '../../component/yes-no-dropdown/yes-no-dropdown.component';

type SaveStatus = 'idle' | 'saving' | 'saved';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatError, YesNoDropdownComponent]
})
export class SettingsComponent implements OnInit, OnDestroy {
  titleControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  canEditControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  exportHasPopupControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  status: SaveStatus = 'idle';

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.applySettingsValuesToFormControls();

    // Show the pending state as soon as a key lands, so the status never
    // claims "Saved" while an edit is still in flight.
    this.titleControl.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.status = 'saving');

    // Let typing settle so a title is written once instead of once per key.
    this.titleControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe(() => this.save());

    // Picking from a dropdown is already a finished decision.
    this.canEditControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe(() => this.save());

    this.exportHasPopupControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe(() => this.save());
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.settingsService.ngOnDestroy();
  }

  resetEverything(): void {
    const dialogRef = this.getConfirmationPopup(RESET_EVERYTHING_MESSAGE);
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldReset => {
        if (shouldReset) {
          this.settingsService.resetEverything();
          this.applySettingsValuesToFormControls();
          this.status = 'idle';
          this.alertService.success(RESET_EVERYTHING_SUCCESS_MESSAGE);
        } else {
          this.alertService.actionCancelled();
        }
      });
    }
  }

  resetOnlyScores(): void {
    const dialogRef = this.getConfirmationPopup(RESET_SCORES_MESSAGE);
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldReset => {
        if (shouldReset) {
          this.alertService.success(RESET_SCORES_SUCCESS_MESSAGE);
        } else {
          this.alertService.actionCancelled();
        }
      });
    }
  }

  // Seeding the form is not an edit, so it must not trigger a save.
  applySettingsValuesToFormControls(): void {
    this.titleControl.setValue(this.settingsService.title, {emitEvent: false});
    this.canEditControl.setValue(this.settingsService.canEdit, {emitEvent: false});
    this.exportHasPopupControl.setValue(this.settingsService.exportHasPopup, {emitEvent: false});
  }

  private save(): void {
    if (!this.titleControl.valid) {
      this.status = 'idle';
      return;
    }

    this.settingsService.applySettings(
      this.titleControl.value,
      this.canEditControl.value,
      this.exportHasPopupControl.value
    );
    this.status = 'saved';
  }

  private getConfirmationPopup(label: string): any {
    return this.dialog.open(ConfirmationPopupComponent, {
      data: {
        label
      },
      id: 'confirmation-modal',
      width: '35vw'
    });
  }
}
