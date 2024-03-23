import { ChangeDetectorRef, Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StrainCartService } from 'src/app/core/services/strain-cart.service';
import { Strain, StrainRequest } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { CCASMService } from '../../core/services/ccasm.services';
import { TermsComponent } from './terms/terms.component';
import { Observable } from 'rxjs';
import { CartStrainDialogueComponent } from './cart-strain-dialogue/cart-strain-dialogue.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {

    dataSource: MatTableDataSource<Strain> = new MatTableDataSource<Strain>([]);
    obs: Observable<any> = new Observable<any>(); // Initialize obs
    @ViewChild(MatPaginator) paginator!: MatPaginator; // Initialize paginator

    applyForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],],
        lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],],
        email: ['', [Validators.required, Validators.email]],
        affiliation: ['', [Validators.required, Validators.minLength(3)]],
        message: [''],
        checkbox: [false, [Validators.requiredTrue]],
        cart: [false, [Validators.requiredTrue]]
    });

    services = inject(CCASMService);
    scs = inject(StrainCartService);

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
    ) {
        this.applyForm.valueChanges.subscribe(val => {
            console.log(val);
            this.localStorageService.setItem('formData', JSON.stringify(val));
        });
    }

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
        this.services.postRequest(sr).subscribe({
            // Success
            next: (data) => {
                this.msg = 'Request Sent!';
                console.log(data);
            },
            // Failure
            error: (error) => {
                this.msg = 'Request Failed!';
                console.log('Post failed', error);
            },
        });
    }

    num : string = '';

    build() {
        
        this.num = '';
        this.dataSource.data.forEach((strain: Strain) => {
            if (this.num === '') {
                this.num = this.num.concat(String(strain.ccasmId));
            } else {
                this.num = this.num.concat(',', String(strain.ccasmId));
            }
        });

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

        this.submitRequest(newStrainRequest);
    }

    exportAll(): void {
        if (this.dataSource.data.length > 0) {
            Utils.exportToCSV(
                this.dataSource.data,
                'CCASM-' + Utils.formatDate(new Date()) + '.csv'
            );
        }
    }

    openTerms(): void {
        this.applyForm.controls['checkbox'].setValue(true);
        this.dialog.open(TermsComponent, { width: '600px' });
    }

    openStrainInformation(s : Observable<Strain>): void {
        this.dialog.open(CartStrainDialogueComponent, {
            width: '600px',
            data: s,
        });
    }

    removeStrain(i: number): void {
        console.log('Removing strain id:' + i);
        this.scs.removeStrainById(i.toString());
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
