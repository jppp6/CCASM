import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';

@Injectable({
  providedIn: 'root',
})
export class CCASMService {
  // CHANGE THIS TO THE RIGHT PATH
  readonly url = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getStrain(strainId: number): Observable<Strain> {
    const strainIdString = strainId.toString();
    return this.http.get<Strain>(this.url + '/strain/' + strainIdString);
  }

  getStrains(): Observable<{ strains: Strain[] }> {
    return this.http.get<{ strains: Strain[] }>(this.url + '/strains/');
  }

  getStrainsBySearch(searchString: string): Observable<Strain[]> {
    // add the logic for passing search strings on the search
    return this.http.get<Strain[]>(this.url + '/strain/search');
  }

  getStrainsByComplexSearch(searchStrings: {
    column: string;
  }): Observable<Strain[]> {
    // add the logic for passing search strings on the complex search
    return this.http.get<Strain[]>(this.url + '/strain/search');
  }

  getStrainsByProvince(province: string): Observable<Strain[]> {
    // add the logic for passing search strings on the province search
    return this.http.get<Strain[]>(this.url + '/strain/search');
  }

  postStrain(strain: Strain): Observable<void> {
    // add the logic for passing strain in post
    return this.http.post<void>(this.url + '/strain', strain);
  }

  deleteStrain(strainId: number): Observable<void> {
    const strainIdString = strainId.toString();
    return this.http.delete<void>(this.url + '/strain/' + strainIdString);
  }

  getCollectionStatistics(): Observable<void> {
    // update the type for stats
    return this.http.get<void>(this.url + '/statistics');
  }

  // LOOOK INTO PASSING AUTH PERMISSIONS FROM ADMIN USERS
  getStrainRequest(requestId: number): Observable<StrainRequest> {
    const requestIdString = requestId.toString();
    return this.http.get<StrainRequest>(
      this.url + '/strain-request/' + requestIdString
    );
  }

  getStrainRequests(): Observable<StrainRequest[]> {
    return this.http.get<StrainRequest[]>(this.url + '/strain-requests');
  }

  postStrainRequest(request: StrainRequest): Observable<void> {
    // format the post into an http body
    return this.http.post<void>(this.url + '/strain-request', request);
  }

  getStrainDeposit(depositId: number): Observable<StrainDeposit> {
    const depositIdString = depositId.toString();
    return this.http.get<StrainDeposit>(
      this.url + '/strain-deposit/' + depositIdString
    );
  }

  getStrainDeposits(): Observable<StrainDeposit[]> {
    return this.http.get<StrainDeposit[]>(this.url + '/strain-deposits');
  }

  postStrainDeposit(deposit: StrainDeposit): Observable<void> {
    // format the post into an http body
    return this.http.post<void>(this.url + '/strain-deposit', deposit);
  }
}
