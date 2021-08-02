import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Person} from '../../model/person.model';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent implements OnInit {
  person: Person;
  firstNameControl: FormControl = new FormControl('', [Validators.required]);
  lastNameControl: FormControl = new FormControl('', [Validators.required]);
  emailControl: FormControl = new FormControl('', [Validators.required]);

  personFormGroup: FormGroup;

  ngOnInit() {
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPersonComponent>,
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.person = data.person;
    }

    this.firstNameControl = new FormControl(this.person.firstName, [Validators.required]);
    this.lastNameControl = new FormControl(this.person.lastName, [Validators.required]);
    this.emailControl = new FormControl(this.person.email, [Validators.required]);

    this.personFormGroup = new FormGroup({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl
    });
  }

  editProduct(): void {
    this.person.firstName = this.firstNameControl.value;
    this.person.lastName = this.lastNameControl.value;
    this.person.email = this.emailControl.value;

    this.settingsService.editPerson(this.person);
    this.clearFormControl();
    this.alertService.success(this.person.firstName + ' ' + this.person.lastName + ' edited successfully', Date.now());
    this.cancel(true);
  }

  clearFormControl(): void {
    this.firstNameControl.setValue('');
    this.lastNameControl.setValue('');
    this.emailControl.setValue('');
    this.firstNameControl.markAsUntouched();
    this.lastNameControl.markAsUntouched();
    this.emailControl.markAsUntouched();
  }

  cancel(success: boolean): void {
    this.dialogRef.close(success);
  }
}
