import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.css'],
})
export class TermsComponent {
    @ViewChild('dialogContent') dialogContent: any;
    scrolledToBottom = false;

    // Handle Scrolling code
    ngAfterViewInit() {
        const dialogCE = this.dialogContent.nativeElement;

        dialogCE.addEventListener('scroll', () => {
            const ratio =
                dialogCE.clientHeight /
                (dialogCE.scrollHeight - dialogCE.scrollTop);
            this.scrolledToBottom = ratio > 0.9;
        });
    }

    @Output() accepted = new EventEmitter<void>();

    // Accept code
    acceptTerms() {
        if (this.scrolledToBottom) {
            this.accepted.emit();
        }
    }
}
