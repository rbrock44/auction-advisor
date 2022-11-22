import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EditPurchaseComponent} from './edit-purchase.component';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {ExcelService} from '../../service/excel.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {
  clickElement,
  expectElementDisabled,
  expectElementPresent,
  expectElementPresentAtIndex,
  expectElementToContainContent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';
import {Purchase} from '../../model/purchase.model';
import {HEADER, PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';

describe('EditPurchaseComponent', () => {
  let fixture: ComponentFixture<EditPurchaseComponent>;
  let component;
  let settingsService: SettingsService;
  let alertService: AlertService;
  const purchase = new Purchase({
    id: 0,
    purchasedBy: 0,
    productId: 0,
    amount: 0
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      declarations: [
        EditPurchaseComponent
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            purchase
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close() {
            }
          }
        }
      ],
    }).compileComponents();

    settingsService = TestBed.get(SettingsService);
    alertService = TestBed.get(AlertService);
    fixture = TestBed.createComponent(EditPurchaseComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, HEADER, 'Edit Purchase');
  });

  it('should display id', () => {
    expectElementToContainContent(fixture, '[data-id-label]', 'Id');
    expectElementToContainContent(fixture, 'p', purchase.id.toString());
  });

  it('should have product dropdown', () => {
    const index = 0;

    settingsService.filteredProducts = PRODUCT_OPTIONS;
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Product', index);
    expectElementToContainContentAtIndex(fixture, 'mat-label', 'Select Value', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });

  it('should have purchaser dropdown', () => {
    const index = 1;

    settingsService.people = PEOPLE_OPTIONS;
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Purchaser', index);
    expectElementToContainContentAtIndex(fixture, 'mat-label', 'Select Value', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });

  it('should have amount input', () => {
    expectElementToContainContent(fixture, '[data-amount-label]', 'Amount');
    expectElementPresent(fixture, '[data-amount]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should contain add button', () => {
    expectElementToContainContent(fixture, 'button', 'Save Purchase');
  });

  it('should contain cancel button', () => {
    expectElementToContainContentAtIndex(fixture, 'button', 'Cancel', 1);
  });

  it('should cancel correctly', () => {
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '[data-button-cancel-purchase]');
    fixture.detectChanges();

    expect(settingsSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should edit purchase when clicked', () => {
    const spy = spyOn(alertService, 'success');
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '.save-purchase');
    fixture.detectChanges();

    const controls = [
      component.productControl,
      component.purchaserControl,
      component.amountControl
    ];
    controls.forEach(control => {
      expect(control.value).toEqual('');
    });
    expect(settingsSpy).toHaveBeenCalledTimes(1);
    expect(settingsSpy).toHaveBeenCalledWith(purchase);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Purchase edited successfully');
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should be required fields', () => {
    [
      component.productControl,
      component.purchaserControl,
      component.amountControl
    ].forEach(item => {
      item.setValue('');
      item.updateValueAndValidity();
      fixture.detectChanges();
      expectElementDisabled(fixture, '.save-purchase');
      item.setValue(0);
      fixture.detectChanges();
    });
  });
});
