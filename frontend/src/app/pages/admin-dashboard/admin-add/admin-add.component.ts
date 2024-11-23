import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as csvtojson from 'csvtojson';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { AdminEditComponent } from '../admin-edit/admin-edit.component';

@Component({
    selector: 'app-admin-add',
    templateUrl: './admin-add.component.html',
    styles: ['.invalid { background-color: red !important; color: white;}'],
})
export class AdminAddComponent implements OnInit {
    batchDataSource = new MatTableDataSource<Strain>([]);
    reader: FileReader = new FileReader();

    private _ccasmService = inject(CCASMService);
    private _snackBar = inject(MatSnackBar);
    private _dialog = inject(MatDialog);

    ngOnInit(): void {
        this.reader.onload = async (event) => {
            const data: string = event?.target?.result as string;
            let parsedData = Utils.snackCaseToCamelCase(
                await csvtojson().fromString(data)
            ) as Strain[];

            this.batchDataSource.data = parsedData;
        };
    }

    async onFileUpload(event: any) {
        const file: File = event.target.files[0];
        if (!file) {
            return;
        }
        this.reader.readAsText(file);
    }

    uploadDataIndividual(): void {
        const strain = this.individualData.value;
        this._ccasmService.adminAddStrain(strain).subscribe((res) => {
            if (res.status) {
                this.individualData.reset();
                this._snackBar.open('SUCCESS: Strain added ', 'Close', {
                    duration: 3000,
                });
            } else {
                this._snackBar.open("ERROR: Didn't add strain", 'Close', {
                    duration: 3000,
                });
            }
        });
    }

    uploadDataBatch() {
        const toUpload = [...this.batchDataSource.data];
        toUpload.forEach((s) => {
            if (!this._isRowValid(s)) {
                return;
            }

            this._ccasmService.adminAddStrain(s).subscribe((res) => {
                if (res.status) {
                    // Remove row on success
                    this.batchDataSource.data =
                        this.batchDataSource.data.filter(
                            (strain) => strain.ccasmId !== s.ccasmId
                        );
                    this._snackBar.open(
                        `SUCCESS: ${s.ccasmId} added`,
                        'Close',
                        {
                            duration: 3000,
                        }
                    );
                }
            });
        });
    }

    openStrainEditor(strain: Strain): void {
        const dialogRef = this._dialog.open(AdminEditComponent, {
            width: '700px',
            data: { ...strain, strainId: -1 },
        });

        dialogRef.afterClosed().subscribe((newStrain: Strain) => {
            if (!newStrain) {
                return;
            }
            this.batchDataSource.data = this.batchDataSource.data.map((s) =>
                s.ccasmId === strain.ccasmId ? newStrain : s
            );
        });
    }

    isValidCell(row: Strain, column: string): boolean {
        const value = (row as any)[column];
        switch (column) {
            case 'ccasmId':
                return /^CCASM_\d{6}$/.test(value);
            case 'taxonomicLineage':
                return /^[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*;[ \w]*$/.test(
                    value
                );
            case 'strainName':
            case 'binomialClassification':
            case 'hostPlantSpecies':
            case 'isolationSource':
            case 'isolationProtocol':
            case 'isolationGrowthMediumComposition':
            case 'isolationGrowthMedium':
                return value.trim().length > 0;

            case 'isolationYear':
                const year = +value;
                return !!year && year > 1900;
            case 'isolationGrowthTemperature':
                const temp = +value;
                return !!temp;
            case 'isolationSoilPh':
                const ph = +value;
                return !!ph;
            case 'isolationSoilProvince':
                return this.PROVINCES.includes(value);
            case 'longitude':
            case 'latitude':
                const l = +value;
                return !!l && value >= -180 && value <= 180;
            case 'isPlantPathogen':
                return ['0', '1', 'true', 'false'].includes(value);
            default:
                // genomeSize - riskGroup - colonyMorphology - genomeNcbiAssociation -
                // isolationSoilOrganicMatter - isolationSoilTexture - notes - citation - photo
                return true;
        }
    }

    private _isRowValid(row: Strain): boolean {
        return this.COLUMNS.every((c) => this.isValidCell(row, c));
    }

    readonly PROVINCES: string[] = Utils.getProvinceAbbreviations();
    readonly COLUMNS: string[] = [
        'ccasmId',
        'strainName',
        'binomialClassification',
        'taxonomicLineage',
        'riskGroup',
        'isPlantPathogen',
        'colonyMorphology',
        'hostPlantSpecies',
        'isolationSource',
        'isolationYear',
        'isolationProtocol',
        'isolationGrowthMedium',
        'isolationGrowthTemperature',
        'isolationGrowthMediumComposition',
        'isolationSoilPh',
        'isolationSoilOrganicMatter',
        'isolationSoilTexture',
        'isolationSoilProvince',
        'longitude',
        'latitude',
        'genomeNcbiAssociation',
        'genomeSize',
        'notes',
        'citation',
        'photo',
    ];

    individualData = new FormGroup({
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
        isPlantPathogen: new FormControl<string>('0'),
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
