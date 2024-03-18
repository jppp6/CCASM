import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-admin-edit',
    templateUrl: './admin-edit.component.html',
    styleUrls: ['./admin-edit.component.css'],
})
export class AdminEditComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Strain) {}

    readonly provinceAbbreviations: string[] = Utils.getProvinceAbbreviations();
}
