import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Donation} from '../../model/donation.model';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Add} from '../../abstract/add';
import {clearFormGroup} from '../../constants/constants';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-add-donation',
    templateUrl: './add-donation.component.html',
    styleUrls: ['./add-donation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFormField, MatLabel, MatSelect, FormsModule, ReactiveFormsModule, MatOption, MatError, MatInput]
})
export class AddDonationComponent extends Add implements OnInit {
  // Set when the form is hosted by the add bar, which supplies its own title
  // and keeps the panel open.
  @Input() embedded: boolean = false;

  productControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  donatedByControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  creditToControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  minAmountControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
  estimatedValueControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);

  constructor(
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
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
