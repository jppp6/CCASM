import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';

import { AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-admin-deposits',
    templateUrl: './admin-deposits.component.html',
    styleUrls: ['./admin-deposits.component.css'],
})
export class AdminDepositsComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<StrainDeposit>([]);
    depositStates: string[] = [
        'received',
        'processed',
        'added',
        'refused',
        'archived',
    ];
    displayedColumns: string[] = [
        'depositId',
        'firstName',
        'lastName',
        'affiliation',
        'email',
        'message',
        'depositExcel',
        'depositState',
        'depositCreationDate',
    ];
    filterValue: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService) {}

    ngOnInit(): void {
        this.ccasmService.adminGetDeposits().subscribe((data) => {
            this.dataSource.data = Utils.snackCaseToCamelCase(
                data.deposits
            ) as StrainDeposit[];
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateDepositState(deposit: StrainDeposit) {
        this.ccasmService.adminUpdateDeposit(deposit).subscribe((_) => {
            console.log('updated');
        });
    }

    applyFilter(event: string): void {
        const filterVal = event.trim().toLowerCase();
        this.dataSource.filter = filterVal;
        this.filterValue = filterVal;
    }
}
