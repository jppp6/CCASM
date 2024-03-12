import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strain } from 'src/app/core/utils/ccasm.types';

@Component({
    selector: 'app-admin-edit',
    templateUrl: './admin-edit.component.html',
    styleUrls: ['./admin-edit.component.css'],
})
export class AdminEditComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Strain) {}

    readonly provinceAbbreviations: string[] = [
        'AB',
        'BC',
        'MB',
        'NB',
        'NL',
        'NS',
        'NT',
        'NU',
        'ON',
        'PE',
        'QC',
        'SK',
        'YT',
    ];
}
