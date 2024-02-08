import { Component, inject} from '@angular/core';
import { CCASMService } from '../../core/services/ccasm.services';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {

  services = inject(CCASMService);

  constructor(){}

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    descr: new FormControl(''),
  });

  submitDeposit() {
    this.services.submitDeposit(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
      this.applyForm.value.descr ?? ''
    );
  }
}
