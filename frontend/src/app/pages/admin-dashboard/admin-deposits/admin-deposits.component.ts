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
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { ConfirmationDialog } from 'src/app/core/utils/confirmation.dialog';

@Component({
    selector: 'app-admin-deposits',
    templateUrl: './admin-deposits.component.html',
})
export class AdminDepositsComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<StrainDeposit>([]);
    readonly depositStates: string[] = [
        'received',
        'processed',
        'added',
        'refused',
    ];
    readonly displayedColumns: string[] = [
        'depositId',
        'firstName',
        'lastName',
        'affiliation',
        'email',
        'message',
        'depositState',
        'depositCreationDate',
        'edit',
    ];
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    private _ccasmService = inject(CCASMService);
    private _snackBar = inject(MatSnackBar);
    private _dialog = inject(MatDialog);

    ngOnInit(): void {
        this._ccasmService.adminGetDeposits().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.deposits
            ) as StrainDeposit[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateDepositState(d: StrainDeposit) {
        this._ccasmService.adminUpdateDeposit(d).subscribe((res) => {
            if (res.status) {
                this._snackBar.open('SUCCESS: Deposit updated', 'Close', {
                    duration: 3000,
                });
            } else {
                this._snackBar.open('ERROR: Deposit not updated', 'Close', {
                    duration: 3000,
                });
            }
        });
    }

    deleteDeposit(d: StrainDeposit): void {
        const dialogRef = this._dialog.open(ConfirmationDialog);

        dialogRef.afterClosed().subscribe((confirmation) => {
            if (!confirmation) {
                return;
            }

            this._ccasmService.adminDeleteDeposit(d).subscribe((res) => {
                if (res.status) {
                    this.dataSource.data = this.dataSource.data.filter(
                        (deposit: StrainDeposit) =>
                            deposit.depositId !== d.depositId
                    );
                    this._snackBar.open('SUCCESS: Deposit deleted', 'Close', {
                        duration: 3000,
                    });
                } else {
                    this._snackBar.open('ERROR: Deposit not deleted', 'Close', {
                        duration: 3000,
                    });
                }
            });
        });
    }

    applyFilter(e: string): void {
        const filterVal = e.trim().toLowerCase();
        this.dataSource.filter = filterVal;
        this.filterValue = filterVal;
    }
}
