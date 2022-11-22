import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Purchase} from '../../model/purchase.model';
import {Product} from '../../model/product.model';
import {Edit} from '../../abstract/edit';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.scss']
})
export class EditPurchaseComponent extends Edit {
  purchase: Purchase = new Purchase();
  productControl: FormControl;
  purchaserControl: FormControl;
  amountControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPurchaseComponent>,
    public settingsService: SettingsService,
    private alertService: AlertService,
  ) {
    super(dialogRef);
    if (data) {
      this.purchase = data.purchase;
    }

    this.productControl = new FormControl(this.purchase.productId, [Validators.required]);
    this.purchaserControl = new FormControl(this.purchase.purchasedBy, [Validators.required]);
    this.amountControl = new FormControl(
      this.purchase.amount,
      [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.min(0)]
    );

    this.formGroup = new FormGroup({
      productId: this.productControl,
      purchasedBy: this.purchaserControl,
      amount: this.amountControl,
    });
  }

  clearFormControl(): void {
    this.resetAmountControl(false);
    clearFormGroup(this.formGroup);
  }

  hasPurchase(productId: number): boolean {
    let found = false;
    let purchase: Purchase = this.settingsService.purchases.find(x => x.productId === productId);
    if (purchase) {
      return true;
    }

    return found;
  }

  filterProducts(): Product[] {
    let filteredProducts: Product[] = [];
    this.settingsService.products.forEach(item => {
      if ((this.settingsService.hasDonation(item.id) && !this.hasPurchase(item.id)) || (item.id === this.purchase.productId)) {
        filteredProducts.push(item);
      }
    });

    return filteredProducts;
  }

  edit(): void {
    this.purchase.amount = this.amountControl.value;
    this.purchase.productId = this.productControl.value;
    this.purchase.purchasedBy = this.purchaserControl.value;

    this.settingsService.edit(this.purchase);
    this.clearFormControl();
    this.alertService.success('Purchase edited successfully');
    this.cancel(true);
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

  applyMinSellAmount(): void {
    const productId = this.productControl.value;
    let amount = this.settingsService.donations.find(x => x.productId === productId).minSellAmount;

    this.resetAmountControl(true, amount);
  }
}
