import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  nameControl: FormControl = new FormControl('', [Validators.required]);
  descriptionControl: FormControl = new FormControl('', [Validators.required]);

  productFormGroup: FormGroup;

  showInput: boolean = false;
  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.productFormGroup = new FormGroup({
      name: this.nameControl,
      description: this.descriptionControl,
    });
  }

  addProduct(): void {
    const product: Product = new Product();
    product.name = this.nameControl.value;
    product.description = this.descriptionControl.value;

    this.settingsService.addProduct(product);
    this.clearFormControl();
    this.alertService.success(Product.name + ' added successfully', Date.now());
  }

  switchDisplay(): void {
    this.showInput = !this.showInput;
  }

  clearFormControl(): void {
    this.nameControl.setValue('');
    this.descriptionControl.setValue('');
    this.nameControl.markAsUntouched();
    this.descriptionControl.markAsUntouched();
  }
}
