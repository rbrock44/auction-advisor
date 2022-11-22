import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddDonationComponent} from './add-donation.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {
  clickElement,
  expectElementDisabled,
  expectElementPresent,
  expectElementPresentAtIndex,
  expectElementToContainContent,
  expectElementToContainContentAtIndex,
  hideShowElementsOnClick
} from '../../constants/expectations.spec';
import {MaterialModule} from '../../material.module';
import {Product} from '../../model/product.model';
import {PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';
import {Donation} from '../../model/donation.model';

describe('AddDonationComponent', () => {
  let fixture: ComponentFixture<AddDonationComponent>;
  let component;
  let settingsService: SettingsService;
  let alertService: AlertService;
  const header = '[data-header-title]';

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
        AddDonationComponent,
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    settingsService = TestBed.get(SettingsService);
    alertService = TestBed.get(AlertService);
    fixture = TestBed.createComponent(AddDonationComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, header, 'Add Donation');
  });

  it('should hide or show add panel', () => {
    let elements = [
      '[data-donation-input]',
      '.dropdown-ctn',
      '.donation-value-ctn',
      '.buttons',
    ];

    hideShowElementsOnClick(fixture, elements, header);
  });

  describe('with panel shown', () => {
    beforeEach(() => {
      clickElement(fixture, header);
      fixture.detectChanges();
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
      expectElementToContainContent(fixture, 'button', 'Add Donation');
    });

    it('should add donation when clicked', () => {
      const spy = spyOn(alertService, 'success');
      const settingsSpy = spyOn(settingsService, 'add');
      const donation = new Donation({
        productId: 0,
        donatedBy: 0,
        estimatedValue: 1,
        creditTo: 0,
        minSellAmount: 0
      });

      expectElementDisabled(fixture, 'button');

      component.productControl.setValue(donation.productId);
      component.donatedByControl.setValue(donation.donatedBy);
      component.creditToControl.setValue(donation.creditTo);
      component.estimatedValueControl.setValue(donation.estimatedValue);
      component.minAmountControl.setValue(donation.minSellAmount);

      fixture.detectChanges();

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
      expect(spy).toHaveBeenCalledWith('Donation added successfully');
    });
  });
});
