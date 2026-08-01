import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {Add} from '../../abstract/add';
import {clearFormGroup} from '../../constants/constants';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddProductComponent extends Add implements OnInit {
  // Set when the form is hosted by the add bar, which supplies its own title
  // and keeps the panel open.
  @Input() embedded: boolean = false;

  nameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  descriptionControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
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
