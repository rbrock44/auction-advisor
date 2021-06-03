import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Donation} from '../../model/donation.model';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Product} from '../../model/product.model';
import {Person} from '../../model/person.model';

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.scss']
})
export class AddDonationComponent implements OnInit {
  productControl: FormControl = new FormControl('', [Validators.required]);
  donatedByControl: FormControl = new FormControl('', [Validators.required]);
  creditToControl: FormControl = new FormControl('', [Validators.required]);
  minAmountControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
  estimatedValueControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
  donationFormGroup: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  people: Person[] = [];
  donations: Donation[] = [];

  showInput: boolean = false;
  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.donationFormGroup = new FormGroup({
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

    this.people = this.settingsService.people;
    this.donations = this.settingsService.donations;
    this.products = this.settingsService.products;
    this.getFilteredProducts();
    this.settingsService.getPeopleChange().subscribe( people => {
      this.people = people;
    });

    this.settingsService.getProductsChange().subscribe(products => {
      this.products = products;
      this.getFilteredProducts();
    });
    this.settingsService.getDonationsChange().subscribe(donations => {
      this.donations = donations;
    });
  }

  getFilteredProducts(): void {
    this.filteredProducts = [];
    this.products.forEach(item => {
      if (!this.hasDonation(item.id)) {
        this.filteredProducts.push(item);
      }
    });
  }

  switchDisplay(): void {
    this.showInput = !this.showInput;
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

  addDonation(): void {
    const donation: Donation = new Donation();
    donation.creditTo = this.creditToControl.value;
    donation.productId = this.productControl.value;
    donation.estimatedValue = this.estimatedValueControl.value;
    donation.minSellAmount = this.minAmountControl.value;
    donation.donatedBy = this.donatedByControl.value;

    this.settingsService.addDonation(donation);
    this.clearFormControl();
    this.alertService.success('Donation added successfully', Date.now());
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
