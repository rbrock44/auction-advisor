import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EditProductComponent} from './edit-product.component';
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
import {Product} from '../../model/product.model';

describe('EditProductComponent', () => {
  let fixture: ComponentFixture<EditProductComponent>;
  let component;
  let settingsService: SettingsService;
  let alertService: AlertService;
  const product = new Product({
    id: 0,
    name: 'name',
    description: 'desc',
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
        EditProductComponent
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            product
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
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, '[data-header-title]', 'Edit Product');
  });

  it('should display id', () => {
    expectElementToContainContent(fixture, '[data-id-label]', 'Id');
    expectElementToContainContent(fixture, 'p', product.id.toString());
  });

  it('should have name input', () => {
    expectElementToContainContent(fixture, '[data-name-label]', 'Name');
    expectElementPresent(fixture, '[data-name]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should have description input', () => {
    expectElementToContainContent(fixture, '[data-description-label]', 'Description');
    expectElementPresent(fixture, '[data-description]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should contain add button', () => {
    expectElementToContainContent(fixture, 'button', 'Save Product');
  });

  it('should contain cancel button', () => {
    expectElementToContainContentAtIndex(fixture, 'button', 'Cancel', 1);
  });

  it('should cancel correctly', () => {
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '[data-button-cancel-product]');
    fixture.detectChanges();

    expect(settingsSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should edit product when clicked', () => {
    const spy = spyOn(alertService, 'success');
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '.save-product');
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
    expect(spy).toHaveBeenCalledWith('name edited successfully');
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should be required fields', () => {
    [
      component.nameControl,
      component.descriptionControl,
    ].forEach(item => {
      item.setValue('');
      item.updateValueAndValidity();
      fixture.detectChanges();
      expectElementDisabled(fixture, '.save-product');
      item.setValue(0);
      fixture.detectChanges();
    });
  });
});
