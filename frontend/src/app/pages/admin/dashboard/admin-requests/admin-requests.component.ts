import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { StrainRequest } from 'src/app/core/utils/ccasm.types';

const dummyRequests: StrainRequest[] = [
    {
        requestId: 1,
        firstName: 'Alice',
        lastName: 'Johnson',
        affiliation: 'University X',
        email: 'alice.johnson@example.com',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        strainsRequested: [101, 102],
        requestState: 'received',
        requestCreationDate: new Date('2023-01-15'),
    },
    {
        requestId: 2,
        firstName: 'Bob',
        lastName: 'Smith',
        affiliation: 'Research Institute Y',
        email: 'bob.smith@example.com',
        message:
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        strainsRequested: [103, 104],
        requestState: 'processed',
        requestCreationDate: new Date('2023-02-20'),
    },
    {
        requestId: 3,
        firstName: 'Eva',
        lastName: 'Brown',
        affiliation: 'Company Z',
        email: 'eva.brown@example.com',
        message:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        strainsRequested: [105, 106],
        requestState: 'sent',
        requestCreationDate: new Date('2023-03-10'),
    },
    {
        requestId: 4,
        firstName: 'Charlie',
        lastName: 'Davis',
        affiliation: 'University W',
        email: 'charlie.davis@example.com',
        message:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        strainsRequested: [107, 108],
        requestState: 'refused',
        requestCreationDate: new Date('2023-04-05'),
    },
    {
        requestId: 5,
        firstName: 'Grace',
        lastName: 'Martinez',
        affiliation: 'Organization V',
        email: 'grace.martinez@example.com',
        message:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        strainsRequested: [109, 110],
        requestState: 'received',
        requestCreationDate: new Date('2023-05-12'),
    },
    {
        requestId: 6,
        firstName: 'Frank',
        lastName: 'Lee',
        affiliation: 'Institute U',
        email: 'frank.lee@example.com',
        message:
            'Nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        strainsRequested: [111, 112],
        requestState: 'processed',
        requestCreationDate: new Date('2023-06-25'),
    },
    {
        requestId: 7,
        firstName: 'Hannah',
        lastName: 'Wilson',
        affiliation: 'College T',
        email: 'hannah.wilson@example.com',
        message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        strainsRequested: [113, 114],
        requestState: 'sent',
        requestCreationDate: new Date('2023-07-30'),
    },
    {
        requestId: 8,
        firstName: 'Jack',
        lastName: 'Taylor',
        affiliation: 'University S',
        email: 'jack.taylor@example.com',
        message:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        strainsRequested: [115, 116],
        requestState: 'refused',
        requestCreationDate: new Date('2023-08-14'),
    },
    {
        requestId: 9,
        firstName: 'Lily',
        lastName: 'Garcia',
        affiliation: 'Research Institute R',
        email: 'lily.garcia@example.com',
        message:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        strainsRequested: [117, 118],
        requestState: 'received',
        requestCreationDate: new Date('2023-09-22'),
    },
    {
        requestId: 10,
        firstName: 'Max',
        lastName: 'Rodriguez',
        affiliation: 'Company Q',
        email: 'max.rodriguez@example.com',
        message:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        strainsRequested: [119, 120],
        requestState: 'processed',
        requestCreationDate: new Date('2023-10-18'),
    },
];

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

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private ccasmService: CCASMService) {}

    ngOnInit(): void {
        // this.ccasmService.getStrainRequests().subscribe((data) => {
        this.dataSource.data = dummyRequests.concat(dummyRequests);
        // this.dataSource.data =  Utils.snackCaseToCamelCase(
        //     dummyRequests
        // ) as StrainRequest[];
        // });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateRequestState(request: StrainRequest) {
        // this.ccasmService.updateStrainRequest(request).subscribe((_) => {
        //     console.log('updated');
        // });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
