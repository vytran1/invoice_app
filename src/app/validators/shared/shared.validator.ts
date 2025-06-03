import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function minFormArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minFormArrayLength: true };
    }
    return null;
  };
}
