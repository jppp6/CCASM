import { Component, OnInit, inject} from '@angular/core';
import { CCASMService } from '../../core/services/ccasm.services';
import { Strain, StrainRequest } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { StrainCartService } from 'src/app/core/services/strain-cart.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
 

  applyForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    email: ['', [Validators.required, Validators.email]],
    affiliation: ['', [Validators.required, Validators.minLength(3)]],
    message: [''],
    checkbox: [null, [Validators.required]],
  });

  services = inject(CCASMService)
  scs = inject(StrainCartService)

  constructor(private fb: FormBuilder) {
    this.applyForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {}

  msg = ""

  submitRequest(sr : StrainRequest) {
    //submit form logic here
    this.services.postStrainRequest(sr).subscribe(
      {
        // Success 
        next: () => {
          this.msg = "Request Sent!"
          console.log('Post success');
        },
        // Failure
        error: (error) => {
          this.msg = "Request Failed!"
          console.log('Post failed', error);
        } 
      }
    )
  }

  build() {
      const newStrainRequest: StrainRequest = {
        requestId: 1,  //Temporary assignment
        firstName: this.applyForm.controls.firstName.value!,
        lastName: this.applyForm.controls.lastName.value!,
        affiliation: this.applyForm.controls.affiliation.value!,
        email: this.applyForm.controls.email.value!,
        message: this.applyForm.controls.message.value!,
        strainsRequested: [],
        requestState: 'received',
        requestCreationDate: new Date()
      }

      this.submitRequest(newStrainRequest)
  }

  exportAll(): void {
    if (this.scs.getSelectedStrains().length > 0) {
        Utils.exportToCSV(
            this.scs.getSelectedStrains(),
            'CCASM-' + Utils.formatDate(new Date()) + '.csv'
        );
    }
  }

  get f() {
    return this.applyForm.controls;
  }
}
