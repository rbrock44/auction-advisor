import {Component, Inject, OnInit} from '@angular/core';
import {Person} from '../../model/person.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Donation} from '../../model/donation.model';
import {Product} from '../../model/product.model';

@Component({
  selector: 'app-edit-donation',
  templateUrl: './edit-donation.component.html',
  styleUrls: ['./edit-donation.component.scss']
})
export class EditDonationComponent implements OnInit {
  donation: Donation;
  productControl: FormControl;
  donatedByControl: FormControl;
  creditToControl: FormControl;
  minAmountControl: FormControl;
  estimatedValueControl: FormControl;
  donationFormGroup: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  people: Person[] = [];
  donations: Donation[] = [];

  ngOnInit() {
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDonationComponent>,
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.donation = data.donation;
    }

    this.people = this.settingsService.people;
    this.donations = this.settingsService.donations;
    this.products = this.settingsService.products;
    this.getFilteredProducts();
    this.settingsService.getPeopleChange().subscribe(people => {
      this.people = people;
    });

    this.settingsService.getProductsChange().subscribe(products => {
      this.products = products;
      this.getFilteredProducts();
    });
    this.settingsService.getDonationsChange().subscribe(donations => {
      this.donations = donations;
    });

    this.productControl = new FormControl(this.donation.productId, [Validators.required]);
    this.donatedByControl = new FormControl(this.donation.donatedBy, [Validators.required]);
    this.creditToControl = new FormControl(this.donation.creditTo, [Validators.required]);
    this.minAmountControl = new FormControl(this.donation.minSellAmount, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
    this.estimatedValueControl = new FormControl(
      this.donation.estimatedValue,
      [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]
    );

    this.donationFormGroup = new FormGroup({
      donatedBy: this.donatedByControl,
      productId: this.productControl,
      estimatedValue: this.estimatedValueControl,
      minSellAmount: this.minAmountControl,
      creditTo: this.creditToControl
    });
  }

  cancel(success: boolean): void {
    this.dialogRef.close(success);
  }

  getFilteredProducts(): void {
    this.filteredProducts = [];
    this.products.forEach(item => {
      if (!this.hasDonation(item.id) || this.donation.productId === item.id) {
        this.filteredProducts.push(item);
      }
    });
  }

  hasDonation(productId: number): boolean {
    let found = false;
    let donation = this.donations.find(x => x.productId === productId);
    if (donation) {
      return true;
    }

    return found;
  }

  donatedBySelected(): void {
    this.creditToControl.setValue(this.donatedByControl.value);
    this.creditToControl.updateValueAndValidity();
  }

  editDonation(): void {
    this.donation.creditTo = this.creditToControl.value;
    this.donation.productId = this.productControl.value;
    this.donation.estimatedValue = this.estimatedValueControl.value;
    this.donation.minSellAmount = this.minAmountControl.value;
    this.donation.donatedBy = this.donatedByControl.value;

    this.settingsService.editDonation(this.donation);
    this.clearFormControl();
    this.alertService.success('Donation edited successfully', Date.now());
    this.cancel(true);
  }

  clearFormControl(): void {
    this.creditToControl.setValue('');
    this.productControl.setValue('');
    this.estimatedValueControl.setValue('');
    this.minAmountControl.setValue('');
    this.donatedByControl.setValue('');
    this.creditToControl.markAsUntouched();
    this.productControl.markAsUntouched();
    this.estimatedValueControl.markAsUntouched();
    this.minAmountControl.markAsUntouched();
    this.donatedByControl.markAsUntouched();
  }
}
