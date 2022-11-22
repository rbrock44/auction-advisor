import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Purchase} from '../../model/purchase.model';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Product} from '../../model/product.model';
import {Donation} from '../../model/donation.model';
import {Add} from '../../abstract/add';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.scss']
})
export class AddPurchaseComponent extends Add implements OnInit {
  productControl: FormControl = new FormControl('', [Validators.required]);
  purchaserControl: FormControl = new FormControl('', [Validators.required]);
  amountControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.min(0)]);

  constructor(
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      productId: this.productControl,
      purchasedBy: this.purchaserControl,
      amount: this.amountControl,
    });
  }

  applyMinSellAmount(): void {
    const productId = this.productControl.value;
    let amount = 0;
    let donation: Donation = this.settingsService.donations.find(x => x.productId === productId);
    if (donation) {
      amount = donation.minSellAmount;
    }

    this.resetAmountControl(true, amount);
  }

  filterProducts(): Product[] {
    let filteredProducts: Product[] = [];
    this.settingsService.products.forEach(item => {
      if (this.settingsService.hasDonation(item.id) && !this.settingsService.hasPurchase(item.id)) {
        filteredProducts.push(item);
      }
    });

    return filteredProducts;
  }

  add(): void {
    const purchase: Purchase = new Purchase();
    purchase.amount = this.amountControl.value;
    purchase.productId = this.productControl.value;
    purchase.purchasedBy = this.purchaserControl.value;

    this.settingsService.add(purchase);
    this.clearFormControl();
    this.alertService.success('Purchase added successfully');
  }

  clearFormControl(): void {
    this.resetAmountControl(false);
    clearFormGroup(this.formGroup);
  }

  resetAmountControl(customAmount: boolean, value: number = 0): void {
    if (customAmount) {
      this.amountControl =
        new FormControl(this.amountControl.value, [Validators.required, Validators.min(value), Validators.pattern('^(0|[1-9][0-9]*)$')]);
    } else {
      this.amountControl = new FormControl(this.amountControl.value, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
    }
    this.formGroup.removeControl('amount');
    this.formGroup.addControl('amount', this.amountControl);
  }
}
