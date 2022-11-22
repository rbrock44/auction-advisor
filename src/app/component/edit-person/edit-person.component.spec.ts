import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EditPersonComponent} from './edit-person.component';
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
import {Person} from '../../model/person.model';

describe('EditPersonComponent', () => {
  let fixture: ComponentFixture<EditPersonComponent>;
  let component;
  let settingsService: SettingsService;
  let alertService: AlertService;
  const person = new Person({
    id: 0,
    firstName: 'first',
    lastName: 'last',
    email: 'email',
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
        EditPersonComponent
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            person
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
    fixture = TestBed.createComponent(EditPersonComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, '[data-header-title]', 'Edit Person');
  });

  it('should display id', () => {
    expectElementToContainContent(fixture, '[data-id-label]', 'Id');
    expectElementToContainContent(fixture, 'p', person.id.toString());
  });

  it('should have first name input', () => {
    expectElementToContainContent(fixture, '[data-first-name-label]', 'First Name');
    expectElementPresent(fixture, '[data-first-name]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should have last name input', () => {
    expectElementToContainContent(fixture, '[data-last-name-label]', 'Last Name');
    expectElementPresent(fixture, '[data-last-name]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should have email input', () => {
    expectElementToContainContent(fixture, '[data-email-label]', 'Email');
    expectElementPresent(fixture, '[data-email]');
    expectElementPresentAtIndex(fixture, 'input', 1);

  });

  it('should contain add button', () => {
    expectElementToContainContent(fixture, 'button', 'Save Person');
  });

  it('should contain cancel button', () => {
    expectElementToContainContentAtIndex(fixture, 'button', 'Cancel', 1);
  });

  it('should cancel correctly', () => {
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '[data-button-cancel-person]');
    fixture.detectChanges();

    expect(settingsSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should edit person when clicked', () => {
    const spy = spyOn(alertService, 'success');
    const settingsSpy = spyOn(settingsService, 'edit');
    const closeSpy = spyOn(component, 'cancel');

    clickElement(fixture, '.save-person');
    fixture.detectChanges();

    const controls = [
      component.firstNameControl,
      component.lastNameControl,
      component.emailControl,
    ];
    controls.forEach(control => {
      expect(control.value).toEqual('');
    });
    expect(settingsSpy).toHaveBeenCalledTimes(1);
    expect(settingsSpy).toHaveBeenCalledWith(person);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('first last edited successfully');
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should be required fields', () => {
    [
      component.firstNameControl,
      component.lastNameControl,
      component.emailControl,
    ].forEach(item => {
      item.setValue('');
      item.updateValueAndValidity();
      fixture.detectChanges();
      expectElementDisabled(fixture, '.save-person');
      item.setValue(0);
      fixture.detectChanges();
    });
  });
});
