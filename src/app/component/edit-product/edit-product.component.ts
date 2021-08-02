import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product: Product;
  nameControl: FormControl;
  descriptionControl: FormControl;

  productFormGroup: FormGroup;

  ngOnInit() {
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditProductComponent>,
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.product = data.product;
    }

    this.nameControl = new FormControl(this.product.name, [Validators.required]);
    this.descriptionControl = new FormControl(this.product.description, [Validators.required]);

    this.productFormGroup = new FormGroup({
      name: this.nameControl,
      description: this.descriptionControl,
    });
  }

  editProduct(): void {
    this.product.name = this.nameControl.value;
    this.product.description = this.descriptionControl.value;

    this.settingsService.editProduct(this.product);
    this.clearFormControl();
    this.alertService.success(this.product.name + ' edited successfully', Date.now());
    this.cancel(true);
  }

  clearFormControl(): void {
    this.nameControl.setValue('');
    this.descriptionControl.setValue('');
    this.nameControl.markAsUntouched();
    this.descriptionControl.markAsUntouched();
  }

  cancel(success: boolean): void {
    this.dialogRef.close(success);
  }
}
