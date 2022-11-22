import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EditDonationComponent} from './edit-donation.component';
import {
  clickElement,
  expectElementDisabled,
  expectElementPresent,
  expectElementPresentAtIndex,
  expectElementToContainContent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';
import {HEADER, PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';
import {Donation} from '../../model/donation.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MaterialModule} from '../../material.module';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExcelService} from '../../service/excel.service';

describe('EditDonationComponent', () => {
  let fixture: ComponentFixture<EditDonationComponent>;
  let component;
  let settingsService: SettingsService;
  let alertService: AlertService;
  let donation = new Donation({
    productId: 0,
    donatedBy: 0,
    minSellAmount: 0,
    estimatedValue: 0,
    creditTo: 0,
    id: 0
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
        EditDonationComponent
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            donation
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
    fixture = TestBed.createComponent(EditDonationComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, HEADER, 'Edit Donation');
  });

  it('should display id', () => {
    expectElementToContainContent(fixture, '[data-id-label]', 'Id');
    expectElementToContainContent(fixture, 'p', donation.id.toString());
  });

  it('should have product dropdown', () => {
    const index = 0;

    settingsService.filteredProducts = PRODUCT_OPTIONS;
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Product', index);
    expectElementToContainContentAtIndex(fixture, 'mat-label', 'Select Value', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });

  it('should have donated by dropdown', () => {
    const index = 1;

    settingsService.people = PEOPLE_OPTIONS;
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Donated By', index);
    expectElementToContainContentAtIndex(fixture, 'mat-label', 'Select Value', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });

  it('should have credit to dropdown', () => {
    const index = 2;

    settingsService.people = PEOPLE_OPTIONS;
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Account to Credit', index);
    expectElementToContainContentAtIndex(fixture, 'mat-label', 'Select Value', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });

  it('should have estimation value input', () => {
    expectElementToContainContent(fixture, '[data-estimated-value-label]', 'Estimated Value');
    expectElementPresent(fixture, '[data-estimated-value]');
    expectElementPresentAtIndex(fixture, 'input', 0);

  });

  it('should have min sell input', () => {
    expectElementToContainContent(fixture, '[data-min-amount-label]', 'Minimum Sell Amount');
    expectElementPresent(fixture, '[data-min-amount]');
    expectElementPresentAtIndex(fixture, 'input', 1);
  });

  it('should contain add button', () => {
    expectElementToContainContent(fixture, 'button', 'Save Donation');
  });

  it('should contain cancel button', () => {
    expectElementToContainContentAtIndex(fixture, 'button', 'Cancel', 1);
  });

  it('should cancel correctly', () => {
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '[data-button-cancel-donation]');
    fixture.detectChanges();

    expect(settingsSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should edit donation when clicked', () => {
    const spy = spyOn(alertService, 'success');
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, 'button');
    fixture.detectChanges();

    const controls = [
      component.productControl,
      component.donatedByControl,
      component.creditToControl,
      component.estimatedValueControl,
      component.minAmountControl
    ];
    controls.forEach(control => {
      expect(control.value).toEqual('');
    });
    expect(settingsSpy).toHaveBeenCalledTimes(1);
    expect(settingsSpy).toHaveBeenCalledWith(donation);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Donation edited successfully');
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should be required fields', () => {
    [
      component.productControl,
      component.donatedByControl,
      component.creditToControl,
      component.estimatedValueControl,
      component.minAmountControl
    ].forEach(item => {
      item.setValue('');
      item.updateValueAndValidity();
      fixture.detectChanges();
      expectElementDisabled(fixture, '.save-donation');
      item.setValue(0);
      fixture.detectChanges();
    });
  });
});
