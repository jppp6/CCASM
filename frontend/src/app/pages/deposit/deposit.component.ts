import { Component, inject} from '@angular/core';
import { CCASMService } from '../../core/services/ccasm.services';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {

  filename = ''

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    affiliation: new FormControl(''),
    message: new FormControl(''),
    depositExcel: new FormControl('')
  });


  submitDeposit() {
    // Check deposit values * NOT DONE
    console.log("submit")
  }

  onFileUpload(event: any) {
    // Current file upload * will add more
    const file: File = event.target.files[0]

    if (file) {
      this.filename = file.name
    }

    console.log("File Upload")
  }
}
