import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-yes-no-dropdown',
  template: `
    <div class="dropdown-ctn">
      <div data-dropdown-label class="dropdown__label">
        {{name}}
      </div>
      <div class="dropdown__data">
        <mat-form-field class="dropdown-form-field">
          <mat-label>Select Value</mat-label>
          <mat-select [formControl]="control" (selectionChange)="onChange()"
                      [id]="htmlId">
            <mat-option data-dropdown-option [value]="true" [ngClass]="className">
              {{yesOption}}
            </mat-option>
            <mat-option data-dropdown-option [value]="false" [ngClass]="className">
              {{noOption}}
            </mat-option>
          </mat-select>
          <mat-error data-basic-error *ngIf="!control.valid">
            {{name}} is required
          </mat-error>
        </mat-form-field>
      </div>
    </div>
  `,
  styleUrls: ['./yes-no-dropdown.component.scss']
})
export class YesNoDropdownComponent {
  @Input() control: FormControl;
  @Input() name: string;
  @Input() htmlId: string;
  @Input() yesOption: string = 'Yes';
  @Input() noOption: string = 'No';
  @Output() changeEvent: EventEmitter<void> = new EventEmitter<void>();


  get className(): string {
    return this.htmlId + '-option';
  }

  constructor() {
  }

  onChange(): void {
    this.changeEvent.emit();
  }
}
