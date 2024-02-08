import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  formData = {
    name: '',
    email: '',
    affiliation: '',
    message: '',
    checkbox: false
  };
  submitted = false; //declare a submitted property
  
  onSubmit(form : any) {
    //submit form logic here
    if (form.valid) {
      //do something to validate fields
      console.log("Submission successful")
    } else {
      //Handle form validation issue
      console.log("Invalid form submission, please fill in required fields")
    }
  }
}
