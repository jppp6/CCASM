import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'confirmation-dialog',
    template: `
        <div mat-dialog-content>
            Are you sure? (This action is irreversible)
        </div>
        <div mat-dialog-actions align="end">
            <button
                mat-raised-button
                [mat-dialog-close]="false"
                color="primary"
            >
                No
            </button>
            <button mat-stroked-button [mat-dialog-close]="true" color="warn">
                Yes
            </button>
        </div>
    `,
    standalone: true,
    styleUrls: [],
    imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmationDialog {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) {}
}
