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

    uploadDataIndividual(): void {
        const strain = this.individualData.value;
        this._ccasmService.adminAddStrain(strain).subscribe((res) => {
            if (res.result === 'success') {
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

    // TODO: Work in progress
    async uploadDataBatch() {
        const toUpload = [...this.batchDataSource.data];
        const successes = new Array(toUpload.length).fill(false);
        let toRedo: Strain[] = [];

        for (let i = 0; i < toUpload.length; i++) {
            this._dialog
                .open(AdminEditComponent, {
                    width: '700px',
                    data: { ...toUpload[i], strainId: -1 },
                })
                .afterClosed()
                .subscribe((newStrain) => {
                    if (!newStrain) {
                        toRedo.push(toUpload[i]);
                        return;
                    }
                    this._ccasmService
                        .adminAddStrain(newStrain)
                        .subscribe((res) => {
                            if (res.result === 'success') {
                                successes[i] = true;
                            } else {
                                toRedo.push(toUpload[i]);
                            }
                        });
                    console.log('done');
                });
        }
        this._snackBar.open(
            `Uploaded ${successes.filter((t) => !!t).length}/${
                successes.length
            }`,
            'Close',
            {
                duration: 3000,
            }
        );
        this.batchDataSource.data = toRedo;
    }

    async onFileUpload(event: any) {
        // Current file upload * will add more
        const file: File = event.target.files[0];
        if (!file) {
            return;
        }
        this.reader.readAsText(file);
    }

    readonly provinceAbbreviations: string[] = Utils.getProvinceAbbreviations();
    readonly displayedColumns: string[] = [
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
