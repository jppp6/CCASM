import {
    AfterViewInit,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { ConfirmationDialog } from 'src/app/core/utils/confirmation.dialog';
import { AdminEditComponent } from '../admin-edit/admin-edit.component';

@Component({
    selector: 'app-admin-collection',
    templateUrl: './admin-collection.component.html',
})
export class AdminCollectionComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<Strain>([]);
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    private _ccasmService = inject(CCASMService);
    private _snackBar = inject(MatSnackBar);
    private _dialog = inject(MatDialog);

    ngOnInit(): void {
        this._ccasmService.adminGetCollection().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.strains
            ) as Strain[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    toggleVisibility(s: Strain): void {
        this._ccasmService.adminUpdateStrain(s).subscribe((res) => {
            if (res.status) {
                this._snackBar.open('SUCCESS: Visibility toggled', 'Close', {
                    duration: 3000,
                });
            } else {
                this._snackBar.open('ERROR: Visibility toggled', 'Close', {
                    duration: 3000,
                });
            }
        });
    }

    openStrainEditor(s: Strain): void {
        const dialogRef = this._dialog.open(AdminEditComponent, {
            width: '700px',
            data: { ...s },
        });

        dialogRef.afterClosed().subscribe((newStrain: Strain) => {
            if (!newStrain) {
                return;
            }

            this._ccasmService.adminUpdateStrain(newStrain).subscribe((res) => {
                if (res.status) {
                    this.dataSource.data = this.dataSource.data.map((s) =>
                        s.strainId === newStrain.strainId ? newStrain : s
                    );
                    this._snackBar.open('SUCCESS: Strain updated', 'Close', {
                        duration: 3000,
                    });
                } else {
                    this._snackBar.open('ERROR: Strain not updated', 'Close', {
                        duration: 3000,
                    });
                }
            });
        });
    }

    deleteStrain(s: Strain): void {
        const dialogRef = this._dialog.open(ConfirmationDialog);

        dialogRef.afterClosed().subscribe((confirmation) => {
            if (!confirmation) {
                return;
            }

            this._ccasmService.adminDeleteStrain(s).subscribe((res) => {
                if (res.status) {
                    this.dataSource.data = this.dataSource.data.filter(
                        (strain: Strain) => strain.strainId !== s.strainId
                    );
                    this._snackBar.open('SUCCESS: Strain deleted', 'Close', {
                        duration: 3000,
                    });
                } else {
                    this._snackBar.open('ERROR: Strain not deleted', 'Close', {
                        duration: 3000,
                    });
                }
            });
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
        'strainId',
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
