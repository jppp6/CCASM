import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Strain } from '../utils/ccasm.types';

@Injectable({
  providedIn: 'root',
})
export class CCASMService {
  // CONVERT TO ENV AND MAKE THIS RIGHT
  url = 'localhost';
  constructor(private http: HttpClient) {}

  getStrains(): Observable<Strain[]> {
    return this.http.get<Strain[]>(this.url + '/strains');
  }
}
