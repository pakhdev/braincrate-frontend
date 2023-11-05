import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

export const isFieldOneEqualFieldTwo = (field1: string, field2: string): ValidatorFn => {
    return (formGroup: AbstractControl): ValidationErrors | null => {

        const fieldValue1 = formGroup.get(field1)?.value;
        const fieldValue2 = formGroup.get(field2)?.value;

        if (fieldValue1 !== fieldValue2) {
            formGroup.get(field2)?.setErrors({ notEqual: true });
            return { notEqual: true };
        }

        formGroup.get(field2)?.setErrors(null);
        return null;
    };
};

export const emailDiffersFromOld = (oldEmail: string | undefined): ValidatorFn => {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const oldEmailTrimmed = (oldEmail || '').trim().toLowerCase();
        const newEmailTrimmed = formGroup.value.trim().toLowerCase();

        if (oldEmailTrimmed === newEmailTrimmed) {
            return { emailMatchesOld: true };
        }
        return null;
    };
};