import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { CCASMService } from '../../core/services/ccasm.services';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
    filename = '';
    msg = '';

    // Form group
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
        depositExcel: ['', Validators.required],
    });

    // File reader
    reader: FileReader = new FileReader();

    // Services
    services = inject(CCASMService);
    constructor(private fb: FormBuilder) {
        this.applyForm.valueChanges.subscribe(console.log);
        this.reader.onload = async (event) => {
            // Read file value and stringify it
            const data: string = event?.target?.result as string;
            this.applyForm.patchValue({ depositExcel: JSON.stringify(data) });
        };
    }

    // On page load call
    ngOnInit(): void {}

    // Submit deposit request
    build() {
        // build the strainDeposit Object
        const newStraindeposit: StrainDeposit = {
            depositId: 1, //Temporary assignment
            firstName: this.applyForm.controls.firstName.value!,
            lastName: this.applyForm.controls.lastName.value!,
            email: this.applyForm.controls.email.value!,
            affiliation: this.applyForm.controls.affiliation.value!,
            message: this.applyForm.controls.message.value!,
            depositExcel: this.applyForm.controls.depositExcel.value!,
            depositState: 'received',
            depositCreationDate: new Date(),
        };

        // POST request
        this.submitDeposit(newStraindeposit);
    }

    // Handle post response
    submitDeposit(sd: StrainDeposit) {
        this.services.postDeposit(Utils.camelCaseToSnakeCase(sd)).subscribe({
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

    async onFileUpload(event: any) {
        // File upload
        const file: File = event.target.files[0];

        // Check file is csv
        if (file) {
            this.filename = file.name;
            this.reader.readAsText(file);
            
            // if (file.type === 'text/csv') {
            //     console.log('csv');
            // } else {
            //     console.log('Not csv');
            // }
        }
    }

    get f() {
        return this.applyForm.controls;
    }
}
