import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Person} from '../../model/person.model';
import {Edit} from '../../abstract/edit';
import {clearFormGroup} from '../../constants/constants';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent extends Edit {
  person: Person;
  firstNameControl: FormControl = new FormControl('', [Validators.required]);
  lastNameControl: FormControl = new FormControl('', [Validators.required]);
  emailControl: FormControl = new FormControl('', [Validators.required]);

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

    this.firstNameControl = new FormControl(this.person.firstName, [Validators.required]);
    this.lastNameControl = new FormControl(this.person.lastName, [Validators.required]);
    this.emailControl = new FormControl(this.person.email, [Validators.required]);

    this.formGroup = new FormGroup({
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
