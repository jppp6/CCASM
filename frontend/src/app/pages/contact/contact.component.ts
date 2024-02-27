import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  admins = [
    { name: 'Admin Name', 
    email: 'admin_email@queensu.ca', 
    phone: '+1 234 567 8901', 
    photoPath: 'path_to_admin_photo.jpg' 
  },
    { name: 'Admin Name', 
    email: 'admin_email@queensu.ca', 
    phone: '+1 234 567 8901', 
    photoPath: 'path_to_admin_photo.jpg' 
  },
  ];

}
