import {UntypedFormGroup} from '@angular/forms';

export abstract class Add {
  formGroup: UntypedFormGroup;
  showInput: boolean = false;

  abstract clearFormControl(): void;

  abstract add(): void;

  switchDisplay(): void {
    this.showInput = !this.showInput;
  }
}

