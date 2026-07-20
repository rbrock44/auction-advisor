import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {Add} from '../../abstract/add';
import {addedSuccessfully, clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent extends Add implements OnInit {
  firstNameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  lastNameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  emailControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl,
    });
  }

  add(): void {
    const person: Person = new Person();
    person.email = this.emailControl.value;
    person.firstName = this.firstNameControl.value;
    person.lastName = this.lastNameControl.value;

    this.settingsService.add(person);
    this.clearFormControl();
    this.alertService.success(addedSuccessfully(person.name()));
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
