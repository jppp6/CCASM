import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getStrainsPerProvince(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/strains-per-province`);
  }
  getStrainsPerTaxonomicLevel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/strains-per-taxonomic-level`);
  }
}