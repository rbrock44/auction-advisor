import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {YesNoDropdownComponent} from './yes-no-dropdown.component';
import {MaterialModule} from '../../material.module';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {expectElementToContainContent} from '../../constants/expectations.spec';

describe('YesNoDropdownComponent', () => {
  let fixture: ComponentFixture<YesNoDropdownComponent>;
  let component;
  let name = 'name';
  let yesOption = 'yes';
  let noOption = 'no';
  let htmlId = 'htmlId';
  let control = new FormControl('');

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
        YesNoDropdownComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoDropdownComponent);
    component = fixture.debugElement.componentInstance;
    component.name = name;
    component.htmlId = htmlId;
    component.yesOption = yesOption;
    component.noOption = noOption;
    component.control = control;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have dropdown', () => {
    expectElementToContainContent(fixture, '[data-dropdown-label]', name);
    expectElementToContainContent(fixture, 'mat-label', 'Select Value');
    // verifyDropdownOptions(fixture, options, values, index);
  });
});
