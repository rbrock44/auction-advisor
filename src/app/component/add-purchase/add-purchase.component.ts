import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
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
    styleUrls: ['./add-purchase.component.scss'],
    standalone: false
})
export class AddPurchaseComponent extends Add implements OnInit {
  productControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  purchaserControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  amountControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.min(0)]);

  constructor(
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
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
        new UntypedFormControl(this.amountControl.value, [Validators.required, Validators.min(value), Validators.pattern('^(0|[1-9][0-9]*)$')]);
    } else {
      this.amountControl = new UntypedFormControl(this.amountControl.value, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]);
    }
    this.formGroup.removeControl('amount');
    this.formGroup.addControl('amount', this.amountControl);
  }
}
