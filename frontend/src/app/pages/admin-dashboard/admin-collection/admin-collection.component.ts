import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { AdminEditComponent } from '../admin-edit/admin-edit.component';

@Component({
    selector: 'app-admin-collection',
    templateUrl: './admin-collection.component.html',
    styleUrls: ['./admin-collection.component.css'],
})
export class AdminCollectionComponent {
    dataSource = new MatTableDataSource<Strain>([]);
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.ccasmService.adminGetCollection().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.strains
            ) as Strain[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    openStrainEditor(strain: Strain): void {
        const dialogRef = this.dialog.open(AdminEditComponent, {
            width: '600px',
            data: { ...strain },
        });

        dialogRef.afterClosed().subscribe((newStrain) => {
            if (!newStrain) {
                return;
            }
            const oldStrainIndex = this.dataSource.data.findIndex(
                (s) => s.ccasmId === newStrain.ccasmId
            );
            if (oldStrainIndex >= 0) {
                this.dataSource.data[oldStrainIndex] = { ...newStrain };
                this.dataSource.data = this.dataSource.data; // Triggers the redraw
            }
        });
    }

    applyFilter(event: string): void {
        const filterVal = event.toLowerCase();
        this.dataSource.filter = filterVal.trim();
        this.filterValue = filterVal;
    }

    readonly displayedColumns: string[] = [
        'edit',
        'visible',
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
}
