import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';
import { CCASMService } from '../../core/services/ccasm.services';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
    // More validators will be added later
    applyForm = this.fb.group({
        firstName: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        lastName: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        email: ['', [Validators.required, Validators.email]],
        affiliation: ['', [Validators.required, Validators.minLength(3)]],
        message: [''],
        depositExcel: ['', Validators.required],
    });

    services = inject(CCASMService);
    constructor(private fb: FormBuilder) {
        this.applyForm.valueChanges.subscribe(console.log);
    }

    ngOnInit(): void {}

    msg = '';

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

        //const sd = Utils.camelCaseToSnakeCase(newStraindeposit);

        // POST request
        this.submitDeposit(newStraindeposit);
    }

    submitDeposit(sd: StrainDeposit) {
        this.services.postDeposit(sd).subscribe({
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

    filename = "";

    onFileUpload(event: any) {
        // Current file upload * will add more
        const file = event.target.files[0];

        if (file) {
            
            this.filename = file.name;

            if (file.type === "text/csv") {
                console.log("csv");
                this.applyForm.patchValue( { depositExcel : file.name} );

                //this.applyForm.patchValue( { depositExcel : file} );
            } else {
                console.log("Not csv");
            }
        
            // -TODO- Check the file fits csv format
        }

        console.log('File Upload');
    }

    get f() {
        return this.applyForm.controls;
    }
}
