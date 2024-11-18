import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'admin-strain-edit',
    template: `
        <h2 mat-dialog-title>Editing Strain: {{ data.ccasmId }}</h2>

        <mat-dialog-content>
            <mat-form-field class="w100">
                <mat-label>CCASM ID</mat-label>
                <input matInput [(ngModel)]="data.ccasmId" type="text" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Strain Name</mat-label>
                <input matInput [(ngModel)]="data.strainName" type="text" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Binomial Classification</mat-label>
                <input
                    matInput
                    [(ngModel)]="data.binomialClassification"
                    type="text"
                />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Taxonomic Lineage</mat-label>
                <input
                    matInput
                    [(ngModel)]="data.taxonomicLineage"
                    type="text"
                />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Risk Group</mat-label>
                <input matInput [(ngModel)]="data.riskGroup" type="number" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Is Plant Pathogen</mat-label>
                <input
                    matInput
                    [(ngModel)]="data.isPlantPathogen"
                    type="number"
                />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Isolation Soil Texture</mat-label>
                <input
                    matInput
                    [(ngModel)]="data.isolationSoilTexture"
                    type="text"
                />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Isolation Soil Province</mat-label>
                <mat-select [(ngModel)]="data.isolationSoilProvince">
                    <mat-option
                        *ngFor="let p of provinceAbbreviations"
                        [value]="p"
                    >
                        {{ p }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Longitude</mat-label>
                <input matInput [(ngModel)]="data.longitude" type="number" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Latitude</mat-label>
                <input matInput [(ngModel)]="data.latitude" type="number" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Genome NCBI Association</mat-label>
                <input
                    matInput
                    [(ngModel)]="data.genomeNcbiAssociation"
                    type="text"
                />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Genome Size</mat-label>
                <input matInput [(ngModel)]="data.genomeSize" type="number" />
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Notes</mat-label>
                <textarea matInput [(ngModel)]="data.notes" rows="4"></textarea>
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Citation</mat-label>
                <textarea
                    matInput
                    [(ngModel)]="data.citation"
                    rows="4"
                ></textarea>
            </mat-form-field>
            <mat-form-field class="w100">
                <mat-label>Photo</mat-label>
                <input matInput [(ngModel)]="data.photo" type="text" />
            </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
                Save
            </button>
        </mat-dialog-actions>
    `,
})
export class AdminEditComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Strain) {}

    readonly provinceAbbreviations: string[] = Utils.getProvinceAbbreviations();
}
