import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddProductComponent} from './add-product.component';
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
  hideShowElementsOnClick
} from '../../constants/expectations.spec';
import {Product} from '../../model/product.model';

describe('AddProductComponent', () => {
  let fixture: ComponentFixture<AddProductComponent>;
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
        AddProductComponent,
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
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, '[data-header-title]', 'Add Product');
  });

  it('should hide or show add panel', () => {
    let elements = [
      '[data-product-input]',
      '.product-value-ctn',
      '.buttons',
    ];

    hideShowElementsOnClick(fixture, elements, header);
  });

  describe('with panel shown', () => {
    beforeEach(() => {
      clickElement(fixture, header);
      fixture.detectChanges();
    });

    it('should have name input', () => {
      expectElementToContainContent(fixture, '[data-name-label]', 'Name');
      expectElementPresent(fixture, '[data-name]');
      expectElementPresentAtIndex(fixture, 'input', 0);
    });

    it('should have description input', () => {
      expectElementToContainContent(fixture, '[data-description-label]', 'Description');
      expectElementPresent(fixture, '[data-description]');
      expectElementPresentAtIndex(fixture, 'input', 1);
    });

    it('should contain add button', () => {
      expectElementToContainContent(fixture, 'button', 'Add Product');
    });

    it('should add donation when clicked', () => {
      const spy = spyOn(alertService, 'success');
      const settingsSpy = spyOn(settingsService, 'add');
      const product = new Product({
        name: 'name',
        description: 'desc',
      });

      expectElementDisabled(fixture, 'button');

      component.nameControl.setValue(product.name);
      component.descriptionControl.setValue(product.description);

      fixture.detectChanges();

      clickElement(fixture, 'button');
      fixture.detectChanges();

      const controls = [
        component.nameControl,
        component.descriptionControl,
      ];
      controls.forEach(control => {
        expect(control.value).toEqual('');
      });
      expect(settingsSpy).toHaveBeenCalledTimes(1);
      expect(settingsSpy).toHaveBeenCalledWith(product);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Product added successfully');
    });
  });
});
