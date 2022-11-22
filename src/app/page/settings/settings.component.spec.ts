import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SettingsComponent} from './settings.component';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {MatDialogRef} from '@angular/material';
import {YesNoDropdownComponent} from '../../component/yes-no-dropdown/yes-no-dropdown.component';
import {
  expectElementPresent,
  expectElementPresentAtIndex,
  expectElementToContainContent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';
import {HEADER} from '../../constants/constants.spec';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let component;

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
        SettingsComponent,
        YesNoDropdownComponent
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MatDialogRef,
          useValue: {
            close() {
            },
            open() {
            }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, HEADER, 'Settings');
  });

  it('should have title input', () => {
    expectElementToContainContent(fixture, '[data-title-label]', 'Title');
    expectElementPresent(fixture, '[data-title]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should have color dropdown', () => {
    const index = 1;

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Color - *Applies Immediately', index);
    // verifyDropdownOptions(fixture, options, values, index);
  });
});
