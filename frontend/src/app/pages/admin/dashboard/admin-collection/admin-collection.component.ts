import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-admin-collection',
    templateUrl: './admin-collection.component.html',
    styleUrls: ['./admin-collection.component.css'],
})
export class AdminCollectionComponent {
    dataSource = new MatTableDataSource<Strain>([]);
    displayedColumns: string[] = [
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
        'citationDepositTime',
        'photo',
    ];
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService) {}

    ngOnInit(): void {
        this.ccasmService.getStrainCollection().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.strains
            ) as Strain[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: string): void {
        const filterVal = event.trim().toLowerCase();
        this.dataSource.filter = filterVal;
        this.filterValue = filterVal;
    }
}
