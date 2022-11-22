import {FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

export abstract class Edit {
  formGroup: FormGroup;

  protected constructor(
    public dialogRef: MatDialogRef<any>,
  ) {
    dialogRef.disableClose = true;
  }

  abstract clearFormControl(): void;

  abstract edit(): void;

  cancel(success: boolean): void {
    this.dialogRef.close(success);
  }
}
