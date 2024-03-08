import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';

import { AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CCASMService } from 'src/app/core/services/ccasm.services';

const dummyData: StrainDeposit[] = [
    {
        depositId: 1,
        firstName: 'John',
        lastName: 'Doe',
        affiliation: 'University A',
        email: 'john.doe@example.com',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        depositExcel: 'excel_file_1.xlsx',
        depositState: 'received',
        depositCreationDate: new Date('2023-01-15'),
    },
    {
        depositId: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        affiliation: 'Research Institute B',
        email: 'jane.smith@example.com',
        message:
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        depositExcel: 'excel_file_2.xlsx',
        depositState: 'processed',
        depositCreationDate: new Date('2023-02-20'),
    },
    {
        depositId: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        affiliation: 'Company C',
        email: 'michael.johnson@example.com',
        message:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        depositExcel: 'excel_file_3.xlsx',
        depositState: 'added',
        depositCreationDate: new Date('2023-03-10'),
    },
    {
        depositId: 4,
        firstName: 'Emily',
        lastName: 'Brown',
        affiliation: 'University D',
        email: 'emily.brown@example.com',
        message:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        depositExcel: 'excel_file_4.xlsx',
        depositState: 'refused',
        depositCreationDate: new Date('2023-04-05'),
    },
    {
        depositId: 5,
        firstName: 'David',
        lastName: 'Martinez',
        affiliation: 'Organization E',
        email: 'david.martinez@example.com',
        message:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        depositExcel: 'excel_file_5.xlsx',
        depositState: 'received',
        depositCreationDate: new Date('2023-05-12'),
    },
    {
        depositId: 6,
        firstName: 'Sarah',
        lastName: 'Lee',
        affiliation: 'Institute F',
        email: 'sarah.lee@example.com',
        message:
            'Nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        depositExcel: 'excel_file_6.xlsx',
        depositState: 'processed',
        depositCreationDate: new Date('2023-06-25'),
    },
    {
        depositId: 7,
        firstName: 'Daniel',
        lastName: 'Wilson',
        affiliation: 'College G',
        email: 'daniel.wilson@example.com',
        message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        depositExcel: 'excel_file_7.xlsx',
        depositState: 'added',
        depositCreationDate: new Date('2023-07-30'),
    },
    {
        depositId: 8,
        firstName: 'Olivia',
        lastName: 'Taylor',
        affiliation: 'University H',
        email: 'olivia.taylor@example.com',
        message:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        depositExcel: 'excel_file_8.xlsx',
        depositState: 'refused',
        depositCreationDate: new Date('2023-08-14'),
    },
    {
        depositId: 9,
        firstName: 'James',
        lastName: 'Garcia',
        affiliation: 'Research Institute I',
        email: 'james.garcia@example.com',
        message:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        depositExcel: 'excel_file_9.xlsx',
        depositState: 'received',
        depositCreationDate: new Date('2023-09-22'),
    },
    {
        depositId: 10,
        firstName: 'Sophia',
        lastName: 'Rodriguez',
        affiliation: 'Company J',
        email: 'sophia.rodriguez@example.com',
        message:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        depositExcel: 'excel_file_10.xlsx',
        depositState: 'processed',
        depositCreationDate: new Date('2023-10-18'),
    },
];

@Component({
    selector: 'app-admin-deposits',
    templateUrl: './admin-deposits.component.html',
    styleUrls: ['./admin-deposits.component.css'],
})
export class AdminDepositsComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<StrainDeposit>([]);
    depositStates: string[] = ['received', 'processed', 'added', 'refused'];
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

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService) {}

    ngOnInit(): void {
        // this.ccasmService.getStrainDeposits().subscribe((data) => {
        this.dataSource.data = dummyData;
        // this.dataSource.data =  Utils.snackCaseToCamelCase(
        //     dummyRequests
        // ) as StrainRequest[];
        // });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateDepositState(deposit: StrainDeposit) {
        // this.ccasmService.updateStrainDeposit(deposit).subscribe((_) => {
        //     console.log('updated');
        // });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
