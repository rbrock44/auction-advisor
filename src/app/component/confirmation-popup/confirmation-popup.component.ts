import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PERFORM_THIS_ACTION} from '../../constants/constants';

@Component({
  selector: 'app-confirmation-popup',
  template: `
    <div data-border-div>
      <div data-popup-ctn>
        <div data-question-label class="confirm-label">{{label}}</div>
        <div data-perform-action class="confirm-label">{{performAction}}</div>
        <div class="button-div">
          <button data-confirm-button mat-stroked-button
                  type="button"
                  (click)="closeDialog(true)">
            Confirm
          </button>
          <button type="button" data-cancel-button mat-stroked-button (click)="closeDialog(false)">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  performAction = PERFORM_THIS_ACTION;
  label: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.data) {
      this.label = this.data.label;
    }
  }

  closeDialog(shouldPerformAction: boolean): void {
    this.dialogRef.close(shouldPerformAction);
  }
}
