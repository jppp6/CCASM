import { Component, OnInit, inject} from '@angular/core';
import { CCASMService } from '../../core/services/ccasm.services';
import { StrainDeposit } from 'src/app/core/utils/ccasm.types';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  // More validators will be added later
  applyForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required,Validators.minLength(3), Validators.email]],
    affiliation: ['', [Validators.required, Validators.minLength(3)]],
    message: [''],
    depositExcel: ['', [Validators.required]]
  });

  services = inject(CCASMService)
  constructor(private fb: FormBuilder) {
    this.applyForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {}

  build() {
    console.log(this.applyForm.value, this.applyForm.valid)

    // TODO --- Do some basic checking

    // build the strainDeposit Object
    const newStraindeposit: StrainDeposit = {
      depositId: 1,
      firstName: this.applyForm.controls.firstName.value!,
      lastName: this.applyForm.controls.lastName.value!,
      email: this.applyForm.controls.email.value!,
      affiliation: this.applyForm.controls.affiliation.value!,
      message: this.applyForm.controls.message.value!,
      depositExcel: this.applyForm.controls.depositExcel.value!,
      depositState: 'processed',
      depositCreationDate: new Date()
    }

    // POST request
    this.submitDeposit(newStraindeposit)
  }

  submitDeposit(sd : StrainDeposit) {
    this.services.postStrainDeposit(sd).subscribe(
      {
        // Success 
        next: () => {
          console.log('Post success');
        },
        // Failure
        error: (error) => {
          console.log('Post failed', error);
        } 
      }
    )
  }

  filename = ''
  onFileUpload(event: any) {
    // Current file upload * will add more
    const file: File = event.target.files[0]

    if (file) {
      this.filename = file.name

      // -TODO- Check the file fits csv format

    }

    console.log("File Upload")
  }

  get f() {
    return this.applyForm.controls;
  }
}
