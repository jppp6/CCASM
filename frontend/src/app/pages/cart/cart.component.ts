import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  formData = {
    firstname: '',
    lastname: '',
    email: '',
    affiliation: '',
    message: '',
    checkbox: false
  };
  submitted = false; //declare a submitted property
  
  onSubmit(form : NgForm) {
    //submit form logic here
    if (form.valid) {
      //do something to validate fields
      console.log("Submission successful", this.formData)
    } else {
      //Handle form validation issue
      console.log("Invalid form submission, please fill in required fields")
    }
  }

  onSaveMeta() {
    //save metadat function
    console.log("Meta is saved :)")
  }
}
