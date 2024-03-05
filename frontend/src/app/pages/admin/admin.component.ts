import { Component, OnInit, inject} from '@angular/core';
import { CCASMService } from '../../core/services/ccasm.services';
import { AdminAccount } from 'src/app/core/utils/ccasm.types';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  services = inject(CCASMService)

  constructor(private fb: FormBuilder) {
    this.loginForm.valueChanges.subscribe(console.log);
  }

  login() {
    // TODO validate password and authenticate session token

    const loginReq: AdminAccount = {
      adminId: 1,
      email: this.loginForm.controls.email.value!,
      password: this.loginForm.controls.password.value!,
      creationDate: new Date()
    }

    this.services.postAccount(loginReq).subscribe({
      // TODO do something with the output
      // Success
      next: () => {
        console.log("success");
      },
      // Failure
      error: (error) => {
        console.log("failed", error);
      }
    })
  }

}
