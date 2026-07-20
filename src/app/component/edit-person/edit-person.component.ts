import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Person} from '../../model/person.model';
import {Edit} from '../../abstract/edit';
import {clearFormGroup} from '../../constants/constants';

@Component({
    selector: 'app-edit-person',
    templateUrl: './edit-person.component.html',
    styleUrls: ['./edit-person.component.scss'],
    standalone: false
})
export class EditPersonComponent extends Edit {
  person: Person;
  firstNameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  lastNameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  emailControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPersonComponent>,
    public settingsService: SettingsService,
    private alertService: AlertService,
  ) {
    super(dialogRef);
    if (data) {
      this.person = data.person;
    }

    this.firstNameControl = new UntypedFormControl(this.person.firstName, [Validators.required]);
    this.lastNameControl = new UntypedFormControl(this.person.lastName, [Validators.required]);
    this.emailControl = new UntypedFormControl(this.person.email, [Validators.required]);

    this.formGroup = new UntypedFormGroup({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl
    });
  }

  edit(): void {
    this.person.firstName = this.firstNameControl.value;
    this.person.lastName = this.lastNameControl.value;
    this.person.email = this.emailControl.value;

    this.settingsService.edit(this.person);
    this.clearFormControl();
    this.alertService.success(this.person.name() + ' edited successfully');
    this.cancel(true);
  }

  clearFormControl(): void {
    clearFormGroup(this.formGroup);
  }
}
