import {Component, Inject, OnInit} from '@angular/core';
import {Person} from '../../model/person.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {Purchase} from '../../model/purchase.model';
import {Donation} from '../../model/donation.model';
import {Product} from '../../model/product.model';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.scss']
})
export class EditPurchaseComponent implements OnInit {
  purchase: Purchase;
  productControl: FormControl;
  purchaserControl: FormControl;
  amountControl: FormControl;
  products: Product[] = [];
  people: Person[] = [];
  donations: Donation[] = [];
  purchases: Purchase[] = [];

  purchaseFormGroup: FormGroup;

  ngOnInit() {
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPurchaseComponent>,
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.purchase = data.purchase;
    }
    console.log(this.purchase);

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

    this.productControl = new FormControl(this.purchase.productId, [Validators.required]);
    this.purchaserControl = new FormControl(this.purchase.purchasedBy, [Validators.required]);
    this.amountControl = new FormControl(
      this.purchase.amount,
      [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$'), Validators.min(0)]
    );

    console.log(this.productControl, this.products);
    this.purchaseFormGroup = new FormGroup({
      productId: this.productControl,
      purchasedBy: this.purchaserControl,
      amount: this.amountControl,
    });
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

  getFilteredProducts(): Product[] {
    let filteredProducts: Product[] = [];
    this.products.forEach(item => {
      if ((this.hasDonation(item.id) && !this.hasPurchase(item.id)) || (item.id === this.purchase.productId)) {
        filteredProducts.push(item);
      }
    });

    return filteredProducts;
  }

  editPurchase(): void {
    this.purchase.amount = this.amountControl.value;
    this.purchase.productId = this.productControl.value;
    this.purchase.purchasedBy = this.purchaserControl.value;

    this.settingsService.editPurchase(this.purchase);
    this.clearFormControl();
    this.alertService.success('Purchase edited successfully', Date.now());
    this.cancel(true);
  }

  cancel(success: boolean): void {
    this.dialogRef.close(success);
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

  applyMinSellAmount(): void {
    const productId = this.productControl.value;
    let amount = 0;
    let donation: Donation = this.donations.find(x => x.productId === productId);
    if (donation) {
      amount = donation.minSellAmount;
    }

    this.resetAmountControl(true, amount);
  }
}
