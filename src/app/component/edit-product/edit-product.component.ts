import {Component, Inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Edit} from '../../abstract/edit';
import {clearFormGroup} from '../../constants/constants';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
    standalone: false
})
export class EditProductComponent extends Edit {
  product: Product = new Product();
  nameControl: UntypedFormControl;
  descriptionControl: UntypedFormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditProductComponent>,
    public settingsService: SettingsService,
    private alertService: AlertService,
  ) {
    super(dialogRef);
    if (data) {
      this.product = data.product;
    }

    this.nameControl = new UntypedFormControl(this.product.name, [Validators.required]);
    this.descriptionControl = new UntypedFormControl(this.product.description, [Validators.required]);

    this.formGroup = new UntypedFormGroup({
      name: this.nameControl,
      description: this.descriptionControl,
    });
  }

  edit(): void {
    this.product.name = this.nameControl.value;
    this.product.description = this.descriptionControl.value;

    this.settingsService.edit(this.product);
    this.clearFormControl();
    this.alertService.success(this.product.name + ' edited successfully');
    this.cancel(true);
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
