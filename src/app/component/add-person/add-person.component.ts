import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Person} from '../../model/person.model';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
  firstNameControl: FormControl = new FormControl('', [Validators.required]);
  lastNameControl: FormControl = new FormControl('', [Validators.required]);
  emailControl: FormControl = new FormControl('', [Validators.required]);

  personFormGroup: FormGroup;

  showInput: boolean = false;

  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.personFormGroup = new FormGroup({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl,
    });
  }

  addPerson(): void {
    const person: Person = new Person();
    person.email = this.emailControl.value;
    person.firstName = this.firstNameControl.value;
    person.lastName = this.lastNameControl.value;

    this.settingsService.addPerson(person);
    this.clearFormControl();
    this.alertService.success(person.firstName + ' ' + person.lastName + ' added successfully', Date.now());
  }

  switchDisplay(): void {
    this.showInput = !this.showInput;
  }

  clearFormControl(): void {
    this.lastNameControl.setValue('');
    this.firstNameControl.setValue('');
    this.emailControl.setValue('');
    this.lastNameControl.markAsUntouched();
    this.firstNameControl.markAsUntouched();
    this.emailControl.markAsUntouched();
  }
}
