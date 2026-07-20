import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

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
          @if (!control.valid) {
            <mat-error data-basic-error>
              {{name}} is required
            </mat-error>
          }
        </mat-form-field>
      </div>
    </div>
    `,
    styleUrls: ['./yes-no-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class YesNoDropdownComponent {
  @Input() control: UntypedFormControl;
  @Input() name: string;
  @Input() htmlId: string;
  @Input() yesOption: string = 'Yes';
  @Input() noOption: string = 'No';
  @Output() changeEvent: EventEmitter<void> = new EventEmitter<void>();

  get className(): string {
    return this.htmlId + '-option';
  }

  onChange(): void {
    this.changeEvent.emit();
  }
}
