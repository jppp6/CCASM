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
import { StrainRequest } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { ConfirmationDialog } from 'src/app/core/utils/confirmation.dialog';

@Component({
    selector: 'app-admin-requests',
    templateUrl: './admin-requests.component.html',
})
export class AdminRequestsComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<StrainRequest>([]);
    filterValue: string = '';
    readonly requestStates: string[] = [
        'received',
        'processed',
        'sent',
        'refused',
    ];
    readonly displayedColumns: string[] = [
        'requestId',
        'firstName',
        'lastName',
        'affiliation',
        'email',
        'message',
        'strainsRequested',
        'requestState',
        'requestCreationDate',
        'edit',
    ];

    @ViewChild(MatSort) sort!: MatSort;

    private _ccasmService = inject(CCASMService);
    private _snackBar = inject(MatSnackBar);
    private _dialog = inject(MatDialog);

    ngOnInit(): void {
        this._ccasmService.adminGetRequests().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.requests
            ) as StrainRequest[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateRequestState(request: StrainRequest) {
        this._ccasmService.adminUpdateRequest(request).subscribe((res) => {
            if (res.status) {
                this._snackBar.open('SUCCESS: Request updated', 'Close', {
                    duration: 3000,
                });
            } else {
                this._snackBar.open('ERROR: Request not updated', 'Close', {
                    duration: 3000,
                });
            }
        });
    }

    deleteRequest(r: StrainRequest): void {
        const dialogRef = this._dialog.open(ConfirmationDialog);

        dialogRef.afterClosed().subscribe((confirmation) => {
            if (!confirmation) {
                return;
            }

            this._ccasmService.adminDeleteRequest(r).subscribe((res) => {
                if (res.status) {
                    this.dataSource.data = this.dataSource.data.filter(
                        (request) => request.requestId !== r.requestId
                    );
                    this._snackBar.open('SUCCESS: Request deleted', 'Close', {
                        duration: 3000,
                    });
                } else {
                    this._snackBar.open('ERROR: Request not deleted', 'Close', {
                        duration: 3000,
                    });
                }
            });
        });
    }

    applyFilter(event: string): void {
        const filterVal = event.trim().toLowerCase();
        this.dataSource.filter = filterVal;
        this.filterValue = filterVal;
    }
}
