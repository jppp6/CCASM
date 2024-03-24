import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as csvtojson from 'csvtojson';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
@Component({
    selector: 'app-admin-add',
    templateUrl: './admin-add.component.html',
    styleUrls: ['./admin-add.component.css'],
})
export class AdminAddComponent {
    individualData = new FormGroup({
        strainName: new FormControl<string>('', Validators.required),
        binomialClassification: new FormControl<string>(
            '',
            Validators.required
        ),
        taxonomicLineage: new FormControl<string>('', Validators.required),
        riskGroup: new FormControl<number>(0),
        isPlantPathogen: new FormControl<string>('1'),
        colonyMorphology: new FormControl<string>(''),
        hostPlantSpecies: new FormControl<string>(''),
        isolationSource: new FormControl(''),
        isolationYear: new FormControl(new Date().getFullYear()),
        isolationProtocol: new FormControl<string>(''),
        isolationGrowthMedium: new FormControl<string>(''),
        isolationGrowthTemperature: new FormControl<number>(0),
        isolationGrowthMediumComposition: new FormControl<string>(''),
        isolationSoilPh: new FormControl<number>(0),
        isolationSoilOrganicMatter: new FormControl<string>(''),
        isolationSoilTexture: new FormControl<string>(''),
        isolationSoilProvince: new FormControl<string>(''),
        longitude: new FormControl<number>(0),
        latitude: new FormControl<number>(0),
        genomeNcbiAssociation: new FormControl<string>(''),
        genomeSize: new FormControl<number>(0),
        notes: new FormControl<string>(''),
        citation: new FormControl<string>(''),
        photo: new FormControl<string>(''),
        visible: new FormControl(true),
    });

    batchDataSource = new MatTableDataSource<Strain>([]);
    reader: FileReader = new FileReader();

    constructor(private ccasmService: CCASMService) {
        this.reader.onload = async (event) => {
            const data: string = event?.target?.result as string;
            console.log(data);
            this.batchDataSource.data = Utils.snackCaseToCamelCase(
                await csvtojson().fromString(data)
            ) as Strain[];
        };
    }

    uploadData(t: 'individual' | 'batch'): void {
        if (t === 'individual') {
            const strain = this.individualData.value;
            this.ccasmService.adminAddStrain(strain).subscribe((_) => {});
        } else {
            this.ccasmService
                .adminAddStrains(this.batchDataSource.data)
                .subscribe((_) => {});
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
