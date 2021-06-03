import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Purchase} from '../../model/purchase.model';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Product} from '../../model/product.model';
import {Person} from '../../model/person.model';
import {Donation} from '../../model/donation.model';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.scss']
})
export class AddPurchaseComponent implements OnInit {
  productControl: FormControl = new FormControl('', [Validators.required]);
  purchaserControl: FormControl = new FormControl('', [Validators.required]);
  amountControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.min(0)]);
  products: Product[] = [];
  people: Person[] = [];
  donations: Donation[] = [];
  purchases: Purchase[] = [];


  purchaseFormGroup: FormGroup;

  showInput: boolean = false;
  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.purchaseFormGroup = new FormGroup({
      productId: this.productControl,
      purchasedBy: this.purchaserControl,
      amount: this.amountControl,
    });

    this.people = this.settingsService.people;
    this.products = this.settingsService.products;
    this.purchases = this.settingsService.purchases;
    this.donations = this.settingsService.donations;
    this.settingsService.getPeopleChange().subscribe(people => {
      this.people = people;
    });

    this.settingsService.getProductsChange().subscribe(products => {
      this.products = products;
    });

    this.settingsService.getDonationsChange().subscribe(donations => {
      this.donations = donations;
    });

    this.settingsService.getPurchasesChange().subscribe(purchases => {
      this.purchases = purchases;
    });
  }

  applyMinSellAmount(): void {
    const productId = this.productControl.value;
    let amount = 0;
    let donation: Donation = this.donations.find(x => x.productId === productId);
    if (donation) {
      amount = donation.minSellAmount;
    }

    this.resetAmountControl(true, amount);
  }

  switchDisplay(): void {
    this.showInput = !this.showInput;
  }

  getFilteredProducts(): Product[] {
    let filteredProducts: Product[] = [];
    this.products.forEach(item => {
      if (this.hasDonation(item.id) && !this.hasPurchase(item.id)) {
        filteredProducts.push(item);
      }
    });

    return filteredProducts;
  }

  hasDonation(productId: number): boolean {
    let found = false;
    let donation: Donation = this.donations.find(x => x.productId === productId);
    if (donation) {
      return true;
    }

    return found;
  }

  hasPurchase(productId: number): boolean {
    let found = false;
    let purchase: Purchase = this.purchases.find(x => x.productId === productId);
    if (purchase) {
      return true;
    }

    return found;
  }

  addPurchase(): void {
    const purchase: Purchase = new Purchase();
    purchase.amount = this.amountControl.value;
    purchase.productId = this.productControl.value;
    purchase.purchasedBy = this.purchaserControl.value;

    this.settingsService.addPurchase(purchase);
    this.clearFormControl();
    this.alertService.success('Purchase added successfully.', Date.now());
  }

  clearFormControl(): void {
    this.resetAmountControl(false);
    this.productControl.setValue('');
    this.purchaserControl.setValue('');
    this.amountControl.setValue('');
    this.productControl.markAsUntouched();
    this.purchaserControl.markAsUntouched();
    this.amountControl.markAsUntouched();
  }

  resetAmountControl(customAmount: boolean, value: number = 0): void {
    if (customAmount) {
      this.amountControl =
        new FormControl(this.amountControl.value, [Validators.required, Validators.min(value), Validators.pattern('^(0|[1-9][0-9]*)$')]);
    } else {
      this.amountControl = new FormControl(this.amountControl.value, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
    }
    this.purchaseFormGroup.removeControl('amount');
    this.purchaseFormGroup.addControl('amount', this.amountControl);
  }
}
