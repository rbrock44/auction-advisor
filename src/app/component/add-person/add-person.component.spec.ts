import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddPersonComponent} from './add-person.component';
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
import {Person} from '../../model/person.model';

describe('AddPersonComponent', () => {
  let fixture: ComponentFixture<AddPersonComponent>;
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
        AddPersonComponent,
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
    fixture = TestBed.createComponent(AddPersonComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, '[data-header-title]', 'Add Person');
  });

  it('should hide or show add panel', () => {
    let elements = [
      '[data-person-input]',
      '.person-value-ctn',
      '.buttons',
    ];

    hideShowElementsOnClick(fixture, elements, header);
  });

  describe('with panel shown', () => {
    beforeEach(() => {
      clickElement(fixture, header);
      fixture.detectChanges();
    });

    it('should have first name input', () => {
      expectElementToContainContent(fixture, '[data-first-name-label]', 'First Name');
      expectElementPresent(fixture, '[data-first-name]');
      expectElementPresentAtIndex(fixture, 'input', 0);
    });

    it('should have last name input', () => {
      expectElementToContainContent(fixture, '[data-last-name-label]', 'Last Name');
      expectElementPresent(fixture, '[data-last-name]');
      expectElementPresentAtIndex(fixture, 'input', 1);
    });

    it('should have email input', () => {
      expectElementToContainContent(fixture, '[data-email-label]', 'Email');
      expectElementPresent(fixture, '[data-email]');
      expectElementPresentAtIndex(fixture, 'input', 2);
    });

    it('should contain add button', () => {
      expectElementToContainContent(fixture, 'button', 'Add Person');
    });

    it('should add donation when clicked', () => {
      const spy = spyOn(alertService, 'success');
      const settingsSpy = spyOn(settingsService, 'add');
      const person = new Person({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
      });

      expectElementDisabled(fixture, 'button');

      component.firstNameControl.setValue(person.firstName);
      component.lastNameControl.setValue(person.lastName);
      component.emailControl.setValue(person.email);

      fixture.detectChanges();

      clickElement(fixture, 'button');
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
      expect(spy).toHaveBeenCalledWith('first last added successfully');
    });
  });
});
