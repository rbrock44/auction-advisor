import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../service/settings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ConfirmationPopupComponent} from '../../component/confirmation-popup/confirmation-popup.component';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  colors = [
    {
      name: 'Black',
      value: '--black-color-'
    },
    {
      name: 'Blue',
      value: '--blue-color-'
    },
    {
      name: 'Gray',
      value: '--gray-color-'
    },
    {
      name: 'Gray Dark',
      value: '--gray-dark-color-'
    },
    {
      name: 'Green',
      value: '--green-color-'
    },
    {
      name: 'Orange',
      value: '--orange-color-'
    },
    {
      name: 'Pink',
      value: '--pink-color-'
    },
    {
      name: 'Purple',
      value: '--purple-color-'
    },
    {
      name: 'Red',
      value: '--red-color-'
    },
    {
      name: 'Yellow',
      value: '--yellow-color-'
    },
    {
      name: 'White',
      value: '--white-color-'
    }
  ];

  titleControl: FormControl = new FormControl('', [Validators.required]);
  canEditControl: FormControl = new FormControl('', [Validators.required]);
  colorControl: FormControl = new FormControl('', [Validators.required]);

  settingsFormGroup: FormGroup;

  RESET_EVERYTHING_MESSAGE: string = 'This will reset everything to the default settings.';
  RESET_SCORES_MESSAGE: string = 'This will reset the scores only.';
  APPLY_SETTING_MESSAGE: string = 'Applying settings changes will reset scores.';
  RESET_SCORES_SUCCESS_MESSAGE: string = 'Scores reset successfully.';
  RESET_EVERYTHING_SUCCESS_MESSAGE: string = 'Settings and scores reset successfully.';
  APPLY_SETTING_SUCCESS_MESSAGE: string = 'Settings applied successfully.';
  ACTION_CANCELLED_MESSAGE: string = 'Action Cancelled.';

  constructor(public dialog: MatDialog,
              private alertService: AlertService,
              public settingsService: SettingsService) {
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
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        label: this.RESET_EVERYTHING_MESSAGE
      },
      id: 'confirmation-modal',
      width: '35vw'
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldReset => {
        if (shouldReset) {
          this.settingsService.resetEverything();
          this.applySettingsValuesToFormControls();
          this.alertService.success(this.RESET_EVERYTHING_SUCCESS_MESSAGE, Date.now());
        } else {
          this.alertService.warn(this.ACTION_CANCELLED_MESSAGE, Date.now());
        }
      });
    }
  }

  applyToSettings(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        label: this.APPLY_SETTING_MESSAGE
      },
      id: 'confirmation-modal',
      width: '35vw'
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldApply => {
        if (shouldApply) {
          this.settingsService.applySettings(
            this.titleControl.value,
            this.canEditControl.value
          );
          this.alertService.success(this.APPLY_SETTING_SUCCESS_MESSAGE, Date.now());
        } else {
          this.alertService.warn(this.ACTION_CANCELLED_MESSAGE, Date.now());
        }
      });
    }
  }

  resetOnlyScores(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        label: this.RESET_SCORES_MESSAGE
      },
      id: 'confirmation-modal',
      width: '35vw'
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(shouldReset => {
        if (shouldReset) {
          this.alertService.success(this.RESET_SCORES_SUCCESS_MESSAGE, Date.now());
        } else {
          this.alertService.warn(this.ACTION_CANCELLED_MESSAGE, Date.now());
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
}
