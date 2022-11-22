import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Donation} from '../../model/donation.model';
import {Edit} from '../../abstract/edit';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-edit-donation',
  templateUrl: './edit-donation.component.html',
  styleUrls: ['./edit-donation.component.scss']
})
export class EditDonationComponent extends Edit {
  donation: Donation = new Donation();
  productControl: FormControl = new FormControl('', [Validators.required]);
  donatedByControl: FormControl = new FormControl('', [Validators.required]);
  creditToControl: FormControl = new FormControl('', [Validators.required]);
  minAmountControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
  estimatedValueControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDonationComponent>,
    public settingsService: SettingsService,
    private alertService: AlertService,
  ) {
    super(dialogRef);
    if (data) {
      this.donation = data.donation;
    }

    this.productControl.setValue(this.donation.productId);
    this.donatedByControl.setValue(this.donation.donatedBy);
    this.creditToControl.setValue(this.donation.creditTo);
    this.minAmountControl.setValue(this.donation.minSellAmount);
    this.estimatedValueControl.setValue(this.donation.estimatedValue);

    this.formGroup = new FormGroup({
      donatedBy: this.donatedByControl,
      productId: this.productControl,
      estimatedValue: this.estimatedValueControl,
      minSellAmount: this.minAmountControl,
      creditTo: this.creditToControl
    });
  }

  donatedBySelected(): void {
    this.creditToControl.setValue(this.donatedByControl.value);
    this.creditToControl.updateValueAndValidity();
  }

  edit(): void {
    this.donation.creditTo = this.creditToControl.value;
    this.donation.productId = this.productControl.value;
    this.donation.estimatedValue = this.estimatedValueControl.value;
    this.donation.minSellAmount = this.minAmountControl.value;
    this.donation.donatedBy = this.donatedByControl.value;

    this.settingsService.edit(this.donation);
    this.clearFormControl();
    this.alertService.success('Donation edited successfully');
    this.cancel(true);
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
