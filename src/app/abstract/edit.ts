import {UntypedFormGroup} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export abstract class Edit {
  formGroup: UntypedFormGroup;

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
