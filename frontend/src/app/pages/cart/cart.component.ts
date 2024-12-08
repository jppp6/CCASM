import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StrainCartService } from 'src/app/core/services/strain-cart.service';
import { Strain, StrainRequest } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { CCASMService } from '../../core/services/ccasm.services';
import { CartStrainDialogueComponent } from './cart-strain-dialogue/cart-strain-dialogue.component';
import { TermsComponent } from './terms/terms.component';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
    dataSource: MatTableDataSource<Strain> = new MatTableDataSource<Strain>([]);
    obs: Observable<any> = new Observable<any>(); // Initialize obs
    @ViewChild(MatPaginator) paginator!: MatPaginator; // Initialize paginator

    // form group
    applyForm = this.fb.group({
        firstName: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        lastName: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        email: ['', [Validators.required, Validators.email]],
        affiliation: ['', [Validators.required, Validators.minLength(3)]],
        message: [''],
        checkbox: [false, [Validators.requiredTrue]],
        checkTerms: [false, [Validators.requiredTrue]],
        cart: [false, [Validators.requiredTrue]],
    });

    // Services 
    services = inject(CCASMService);
    scs = inject(StrainCartService);

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService
    ) {
        this.applyForm.valueChanges.subscribe((val) => {
            this.localStorageService.setItem('formData', JSON.stringify(val));
        });
    }

    // On page initial load
    ngOnInit(): void {
        this.cdr.detectChanges();
        this.dataSource.data = this.scs.getSelectedStrains();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();

        const storedData = this.localStorageService.getItem('formData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Fill in from stored value;
            this.applyForm.patchValue(parsedData);
        }

        if (this.dataSource.data.length > 0) {
            this.applyForm.controls['cart'].setValue(true);
        }
    }

    msg = '';

    submitRequest(sr: StrainRequest) {
        //submit form logic here
        this.services.postRequest(Utils.camelCaseToSnakeCase(sr)).subscribe({
            // Success
            next: (data) => {
                this.msg = 'Request Sent!';
            },
            // Failure
            error: (error) => {
                this.msg = 'Request Failed!';
                console.log('Post failed', error);
            },
        });
    }

    num: string = '';

    // Submit strain request
    build() {
        
        // Build string of CCASM id's of the strains in cart
        this.num = '';
        this.dataSource.data.forEach((strain: Strain) => {
            if (this.num === '') {
                this.num = this.num.concat(String(strain.ccasmId));
            } else {
                this.num = this.num.concat(',', String(strain.ccasmId));
            }
        });
        
        // Build strain request object
        const newStrainRequest: StrainRequest = {
            requestId: 1, //Temporary assignment
            firstName: this.applyForm.controls.firstName.value!,
            lastName: this.applyForm.controls.lastName.value!,
            affiliation: this.applyForm.controls.affiliation.value!,
            email: this.applyForm.controls.email.value!,
            message: this.applyForm.controls.message.value!,
            strainsRequested: this.num,
            requestState: 'received',
            requestCreationDate: new Date(),
        };

        // POST
        this.submitRequest(newStrainRequest);
        this.localStorageService.clear();
    }

    // Save the strains in cart in a csv
    exportAll(): void {
        if (this.dataSource.data.length > 0) {
            Utils.exportToCSV(
                this.dataSource.data,
                'CCASM_' + Utils.formatDate(new Date()) + '.csv'
            );
        }
    }

    // Open the terms window
    openTerms(): void {
        const dialogRef = this.dialog.open(TermsComponent, { width: '600px' });

        dialogRef.componentInstance.accepted.subscribe(() => {
            this.applyForm.controls['checkTerms'].setValue(true); // Set checkTerms to true when accepted
            dialogRef.close(); // Close the dialog after acceptance
        });
    }

    // Opens the strain info in a window
    openStrainInformation(s: Observable<Strain>): void {
        this.dialog.open(CartStrainDialogueComponent, {
            width: '600px',
            data: s,
        });
    }

    // Removes strain selected from cart
    removeStrain(id: string): void {
        console.log('Removing strain id:' + id);
        this.scs.removeStrainById(id);
        this.dataSource.data = this.scs.getSelectedStrains();

        if (this.dataSource.data.length === 0) {
            this.applyForm.controls['cart'].setValue(false);
        }

        this.cdr.detectChanges();
    }

    get f() {
        return this.applyForm.controls;
    }
}

