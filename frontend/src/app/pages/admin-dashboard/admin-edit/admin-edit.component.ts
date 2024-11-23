import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'admin-strain-edit',
    template: `
        <h2 mat-dialog-title>Editing Strain: {{ data.strainId }}</h2>

        <mat-dialog-content>
            <form [formGroup]="individualData">
                <mat-checkbox color="primary" formControlName="visible">
                    Is Strain Visible in Collection?
                </mat-checkbox>

                <mat-form-field class="w100">
                    <mat-label> CCASM ID </mat-label>
                    <input matInput formControlName="ccasmId" type="text" />
                    <mat-hint align="start">
                        ^ Format is CCASM_xxxxxx
                    </mat-hint>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Strain Name </mat-label>
                    <input matInput formControlName="strainName" type="text" />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Binomial Classification </mat-label>
                    <input
                        matInput
                        formControlName="binomialClassification"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Taxonomic Lineage </mat-label>
                    <input
                        matInput
                        formControlName="taxonomicLineage"
                        type="text"
                    />
                    <mat-hint align="start">
                        ^ Format is semi-colon seperated (ie: Kingdom; Phylum;
                        Class; Order; Family; Genus; Species)
                    </mat-hint>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Host Plant Species </mat-label>
                    <input
                        matInput
                        formControlName="hostPlantSpecies"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Source </mat-label>
                    <input
                        matInput
                        formControlName="isolationSource"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Year </mat-label>
                    <input
                        matInput
                        formControlName="isolationYear"
                        type="number"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Protocol </mat-label>
                    <input
                        matInput
                        formControlName="isolationProtocol"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Growth Medium </mat-label>
                    <input
                        matInput
                        formControlName="isolationGrowthMedium"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Growth Temperature </mat-label>
                    <input
                        matInput
                        formControlName="isolationGrowthTemperature"
                        type="number"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Growth Medium Composition </mat-label>
                    <input
                        matInput
                        formControlName="isolationGrowthMediumComposition"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Soil PH </mat-label>
                    <input
                        matInput
                        formControlName="isolationSoilPh"
                        type="number"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Soil Organic Matter </mat-label>
                    <input
                        matInput
                        formControlName="isolationSoilOrganicMatter"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Soil Texture </mat-label>
                    <input
                        matInput
                        formControlName="isolationSoilTexture"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Isolation Soil Province </mat-label>
                    <mat-select formControlName="isolationSoilProvince">
                        <mat-option
                            *ngFor="let p of provinceAbbreviations"
                            [value]="p"
                        >
                            {{ p }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Longitude </mat-label>
                    <input matInput formControlName="longitude" type="number" />
                    <mat-hint align="start">
                        ^ Value between -180 and +180
                    </mat-hint>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Latitude </mat-label>
                    <input matInput formControlName="latitude" type="number" />
                    <mat-hint align="start">
                        ^ Value between -180 and +180
                    </mat-hint>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Risk Group </mat-label>
                    <input matInput formControlName="riskGroup" type="number" />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Is Plant Pathogen </mat-label>
                    <mat-select formControlName="isPlantPathogen">
                        <mat-option value="1"> True </mat-option>
                        <mat-option value="0"> False </mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Colony Morphology </mat-label>
                    <input
                        matInput
                        formControlName="colonyMorphology"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Genome NCBI Association </mat-label>
                    <input
                        matInput
                        formControlName="genomeNcbiAssociation"
                        type="text"
                    />
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Genome Size </mat-label>
                    <input
                        matInput
                        formControlName="genomeSize"
                        type="number"
                    />
                    <span matTextSuffix> Mb </span>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Notes </mat-label>
                    <textarea
                        matInput
                        formControlName="notes"
                        rows="4"
                    ></textarea>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Citation </mat-label>
                    <textarea
                        matInput
                        formControlName="citation"
                        rows="4"
                    ></textarea>
                </mat-form-field>

                <mat-form-field class="w100">
                    <mat-label> Photo </mat-label>
                    <input matInput formControlName="photo" type="text" />
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button
                mat-button
                [disabled]="!individualData.valid"
                cdkFocusInitial
                (click)="editSuccess()"
            >
                Save
            </button>
        </mat-dialog-actions>
    `,
})
export class AdminEditComponent {
    constructor(
        private dialogRef: MatDialogRef<AdminEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Strain
    ) {
        this.individualData.setValue({
            strainId: data.strainId,
            visible: data.visible,
            ccasmId: data.ccasmId,
            strainName: data.strainName,
            binomialClassification: data.binomialClassification,
            taxonomicLineage: data.taxonomicLineage,
            hostPlantSpecies: data.hostPlantSpecies,
            isolationSource: data.isolationSource,
            isolationYear: data.isolationYear,
            isolationProtocol: data.isolationProtocol,
            isolationGrowthMedium: data.isolationGrowthMedium,
            isolationGrowthTemperature: data.isolationGrowthTemperature,
            isolationGrowthMediumComposition:
                data.isolationGrowthMediumComposition,
            isolationSoilProvince: data.isolationSoilProvince,
            longitude: data.longitude,
            latitude: data.latitude,
            riskGroup: data.riskGroup,
            isPlantPathogen: data.isPlantPathogen,
            colonyMorphology: data.colonyMorphology,
            isolationSoilPh: data.isolationSoilPh,
            isolationSoilOrganicMatter: data.isolationSoilOrganicMatter,
            isolationSoilTexture: data.isolationSoilTexture,
            genomeNcbiAssociation: data.genomeNcbiAssociation,
            genomeSize: data.genomeSize,
            notes: data.notes,
            citation: data.citation,
            photo: data.photo,
        });
    }

    editSuccess(): void {
        if (!this.individualData.valid) {
            return;
        }
        this.data = this.individualData.value as Strain;
        console.log(this.data);
        this.dialogRef.close(this.data);
    }

    readonly provinceAbbreviations: string[] = Utils.getProvinceAbbreviations();

    individualData = new FormGroup({
        strainId: new FormControl<number>(0, Validators.required),
        visible: new FormControl<boolean>(true, Validators.required),
        ccasmId: new FormControl<string>('CCASM_', [
            Validators.required,
            Validators.pattern(/^CCASM_\d{6}$/),
        ]),
        strainName: new FormControl<string>('', Validators.required),
        binomialClassification: new FormControl<string>(
            '',
            Validators.required
        ),
        taxonomicLineage: new FormControl<string>('', [
            Validators.required,
            Validators.pattern(
                /^[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*$/
            ),
        ]),
        hostPlantSpecies: new FormControl<string>('', Validators.required),
        isolationSource: new FormControl<string>('', Validators.required),
        isolationYear: new FormControl<number>(
            new Date().getFullYear(),
            Validators.required
        ),
        isolationProtocol: new FormControl<string>('', Validators.required),
        isolationGrowthMedium: new FormControl<string>('', Validators.required),
        isolationGrowthTemperature: new FormControl<number>(
            0,
            Validators.required
        ),
        isolationGrowthMediumComposition: new FormControl<string>(
            '',
            Validators.required
        ),
        isolationSoilProvince: new FormControl<string>('', Validators.required),
        longitude: new FormControl<number | null>(null, [
            Validators.min(-180.0),
            Validators.max(180.0),
        ]),
        latitude: new FormControl<number | null>(null, [
            Validators.min(-180.0),
            Validators.max(180.0),
        ]),
        riskGroup: new FormControl<number>(0),
        isPlantPathogen: new FormControl<string>(''),
        colonyMorphology: new FormControl<string>(''),
        isolationSoilPh: new FormControl<number>(0),
        isolationSoilOrganicMatter: new FormControl<string>(''),
        isolationSoilTexture: new FormControl<string>(''),
        genomeNcbiAssociation: new FormControl<string>(''),
        genomeSize: new FormControl<number>(0),
        notes: new FormControl<string>(''),
        citation: new FormControl<string>(''),
        photo: new FormControl<string>(''),
    });
}
