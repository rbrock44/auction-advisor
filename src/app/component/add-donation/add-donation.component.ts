import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Donation} from '../../model/donation.model';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Add} from '../../abstract/add';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.scss']
})
export class AddDonationComponent extends Add implements OnInit {
  productControl: FormControl = new FormControl('', [Validators.required]);
  donatedByControl: FormControl = new FormControl('', [Validators.required]);
  creditToControl: FormControl = new FormControl('', [Validators.required]);
  minAmountControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
  estimatedValueControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);

  constructor(
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      donatedBy: this.donatedByControl,
      productId: this.productControl,
      estimatedValue: this.estimatedValueControl,
      minSellAmount: this.minAmountControl,
      creditTo: this.creditToControl
    });

    // this.donatedByControl.registerOnChange((change) => {
    //   console.log('change', change)
    //   this.creditToControl.setValue(change);
    //   this.creditToControl.updateValueAndValidity();
    // });
  }

  donatedBySelected(): void {
    this.creditToControl.setValue(this.donatedByControl.value);
    this.creditToControl.updateValueAndValidity();
  }

  add(): void {
    const donation: Donation = new Donation({
      creditTo: this.creditToControl.value,
      productId: this.productControl.value,
      estimatedValue: this.estimatedValueControl.value,
      minSellAmount: this.minAmountControl.value,
      donatedBy: this.donatedByControl.value
    });

    this.settingsService.add(donation);
    this.clearFormControl();
    this.alertService.success('Donation added successfully');
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
