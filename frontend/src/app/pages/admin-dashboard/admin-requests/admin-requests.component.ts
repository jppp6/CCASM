import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { StrainRequest } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-admin-requests',
    templateUrl: './admin-requests.component.html',
    styleUrls: ['./admin-requests.component.css'],
})
export class AdminRequestsComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<StrainRequest>([]);
    requestStates: string[] = ['received', 'processed', 'sent', 'refused'];
    displayedColumns: string[] = [
        'requestId',
        'firstName',
        'lastName',
        'affiliation',
        'email',
        'message',
        'strainsRequested',
        'requestState',
        'requestCreationDate',
    ];
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService) {}

    ngOnInit(): void {
        this.ccasmService.adminGetRequests().subscribe((data) => {
            // this.dataSource.data = dummyData;
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.requests
            ) as StrainRequest[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateRequestState(request: StrainRequest) {
        this.ccasmService.adminUpdateRequest(request).subscribe((_) => {
            console.log('updated');
        });
    }

    applyFilter(event: string): void {
        const filterVal = event.trim().toLowerCase();
        this.dataSource.filter = filterVal;
        this.filterValue = filterVal;
    }
}
