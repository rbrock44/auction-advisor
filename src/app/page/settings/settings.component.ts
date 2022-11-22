import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../service/settings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ConfirmationPopupComponent} from '../../component/confirmation-popup/confirmation-popup.component';
import {AlertService} from '../../service/alert.service';
import {
  APPLY_SETTING_MESSAGE,
  APPLY_SETTING_SUCCESS_MESSAGE,
  COLOR_OPTIONS,
  RESET_EVERYTHING_MESSAGE,
  RESET_EVERYTHING_SUCCESS_MESSAGE,
  RESET_SCORES_MESSAGE,
  RESET_SCORES_SUCCESS_MESSAGE
} from '../../constants/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  colors = COLOR_OPTIONS;

  titleControl: FormControl = new FormControl('', [Validators.required]);
  canEditControl: FormControl = new FormControl('', [Validators.required]);
  colorControl: FormControl = new FormControl('', [Validators.required]);

  settingsFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.settingsFormGroup = new FormGroup({
      title: this.titleControl,
    });

    this.applySettingsValuesToFormControls();
  }

  ngOnDestroy(): void {
    this.settingsService.ngOnDestroy();
  }

  resetEverything(): void {
    const dialogRef = this.getConfirmationPopup(RESET_EVERYTHING_MESSAGE);
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldReset => {
        if (shouldReset) {
          this.settingsService.resetEverything();
          this.applySettingsValuesToFormControls();
          this.alertService.success(RESET_EVERYTHING_SUCCESS_MESSAGE);
        } else {
          this.alertService.actionCancelled();
        }
      });
    }
  }

  applyToSettings(): void {
    const dialogRef = this.getConfirmationPopup(APPLY_SETTING_MESSAGE);
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldApply => {
        if (shouldApply) {
          this.settingsService.applySettings(
            this.titleControl.value,
            this.canEditControl.value
          );
          this.alertService.success(APPLY_SETTING_SUCCESS_MESSAGE);
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

  applySettingsValuesToFormControls(): void {
    this.titleControl.setValue(this.settingsService.title);
    this.colorControl.setValue(this.settingsService.color);
    this.canEditControl.setValue(this.settingsService.canEdit);
  }

  setColor(): void {
    this.settingsService.setColor(this.colorControl.value);
  }

  getBackgroundColor(value: string): string {
    return 'var(' + value + 40 + ')';
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
