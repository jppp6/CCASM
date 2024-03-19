import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as csvtojson from 'csvtojson';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
@Component({
    selector: 'app-admin-add',
    templateUrl: './admin-add.component.html',
    styleUrls: ['./admin-add.component.css'],
})
export class AdminAddComponent {
    individualData = new FormGroup({
        strainName: new FormControl('', Validators.required),
        binomialClassification: new FormControl('', Validators.required),
        taxonomicLineage: new FormControl('', Validators.required),
        riskGroup: new FormControl('', Validators.required),
        isPlantPathogen: new FormControl('', Validators.required),
        colonyMorphology: new FormControl('', Validators.required),
        hostPlantSpecies: new FormControl('', Validators.required),
        isolationSource: new FormControl('', Validators.required),
        isolationYear: new FormControl(
            new Date().getFullYear(),
            Validators.required
        ),
        isolationProtocol: new FormControl('', Validators.required),
        isolationGrowthMedium: new FormControl('', Validators.required),
        isolationGrowthTemperature: new FormControl(0, Validators.required),
        isolationGrowthMediumComposition: new FormControl(
            '',
            Validators.required
        ),
        isolationSoilPh: new FormControl(0, Validators.required),
        isolationSoilOrganicMatter: new FormControl('', Validators.required),
        isolationSoilTexture: new FormControl('', Validators.required),
        isolationSoilProvince: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required),
        latitude: new FormControl('', Validators.required),
        genomeNcbiAssociation: new FormControl('', Validators.required),
        genomeSize: new FormControl('', Validators.required),
        notes: new FormControl('', Validators.required),
        citation: new FormControl('', Validators.required),
        photo: new FormControl(''),
        visible: new FormControl(true),
    });

    batchDataSource = new MatTableDataSource<Strain>([]);
    reader: FileReader = new FileReader();

    constructor() {
        this.reader.onload = async (event) => {
            const data: string = event?.target?.result as string;

            this.batchDataSource.data = Utils.snackCaseToCamelCase(
                await csvtojson().fromString(data)
            ) as Strain[];
        };
    }

    uploadData(t: 'individual' | 'batch'): void {
        if (t === 'individual') {
            console.log(this.individualData.value);
        } else {
            console.log(this.batchDataSource);
        }
    }

    async onFileUpload(event: any) {
        // Current file upload * will add more
        const file: File = event.target.files[0];
        if (!file) {
            return;
        }
        this.reader.readAsText(file);
    }

    readonly provinceAbbreviations = Utils.getProvinceAbbreviations();
    readonly displayedColumns: string[] = [
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
}
