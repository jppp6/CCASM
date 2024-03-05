import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';

@Injectable({
  providedIn: 'root',
})
export class CCASMService {
  // CHANGE THIS TO THE RIGHT PATH
  // I'm using the same port for django and angular, however
  // I've included django-cors-middleware in the settings.py
  // we should look into serving django through different port
  // and creating a pipeline to the angular app port for
  // security purposes?
  readonly url = 'http://localhost:4200'; // TODO: change this in future probably

  constructor(private http: HttpClient) {}

  getStrain(strainId: number): Observable<Strain> {
    const strainIdString = strainId.toString();
    return this.http.get<Strain>(this.url + '/strain/' + strainIdString);
  }

  getStrains(): Observable<Strain[]> {
    return this.http.get<Strain[]>(this.url + '/strains');
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

  test(): void{
    console.log(this.http.get<Strain[]>(this.url + '/strains'));
  }
}