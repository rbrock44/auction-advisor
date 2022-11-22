import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {Add} from '../../abstract/add';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent extends Add implements OnInit {
  nameControl: FormControl = new FormControl('', [Validators.required]);
  descriptionControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: this.nameControl,
      description: this.descriptionControl,
    });
  }

  add(): void {
    const product: Product = new Product();
    product.name = this.nameControl.value;
    product.description = this.descriptionControl.value;

    this.settingsService.add(product);
    this.clearFormControl();
    this.alertService.success(Product.name + ' added successfully');
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
