import { Component, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.css'],
})
export class TermsComponent {
    @ViewChild("dialogContent") dialogContent: any;
    scrolledToBottom = false

    // Handle Scrolling code
    ngAfterViewInit() {
        const dialogCE = this.dialogContent.nativeElement;

        dialogCE.addEventListener('scroll', ()=> {
            const isScrolledToBottom = ((dialogCE.scrollHeight - dialogCE.scrollTop) === dialogCE.clientHeight);
            this.scrolledToBottom = isScrolledToBottom;
        })
    }

    @Output() accepted = new EventEmitter<void>();

    // Accept code
    acceptTerms() {
        if (this.scrolledToBottom) {
            console.log("terms")
            this.accepted.emit()
        }
    }
}
