import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageDirective } from './directives/error-message.directive';

@NgModule({
    declarations: [
        ErrorMessageDirective,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ErrorMessageDirective,
    ],
})
export class SharedModule {
}
