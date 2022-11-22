import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddPurchaseComponent} from './add-purchase.component';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
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
import {Purchase} from '../../model/purchase.model';
import {PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';

describe('AddPurchaseComponent', () => {
  let fixture: ComponentFixture<AddPurchaseComponent>;
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
        AddPurchaseComponent,
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
    fixture = TestBed.createComponent(AddPurchaseComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, '[data-header-title]', 'Add Purchase');
  });

  it('should hide or show add panel', () => {
    let elements = [
      '[data-purchase-input]',
      '.purchase-value-ctn',
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
      expectElementToContainContent(fixture, 'button', 'Add Purchase');
    });

    it('should add donation when clicked', () => {
      const spy = spyOn(alertService, 'success');
      const settingsSpy = spyOn(settingsService, 'add');
      const purchase = new Purchase({
        purchasedBy: 0,
        productId: 0,
        amount: 0
      });

      expectElementDisabled(fixture, 'button');

      component.productControl.setValue(purchase.productId);
      component.purchaserControl.setValue(purchase.purchasedBy);
      component.amountControl.setValue(purchase.amount);

      fixture.detectChanges();

      clickElement(fixture, 'button');
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
      expect(spy).toHaveBeenCalledWith('Purchase added successfully');
    });
  });
});
