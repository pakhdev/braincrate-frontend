import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PipeTransform, Pipe, inject } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
    private readonly sanitized = inject(DomSanitizer);

    transform(value: string): SafeHtml {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}