import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CCASMService {
  constructor() {}

  submitDeposit(firstname: string, lastname: string, email: string, descr: string) {
    console.log(`Homes application received: firstName: ${firstname}, lastName: ${lastname}, email: ${email}, description: ${descr}.`);
  }
}
