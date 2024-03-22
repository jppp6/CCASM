import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';

@Injectable({
    providedIn: 'root',
})
export class CCASMService {
    // Make sure to change this to the Domain name when deployed
    readonly url = 'http://localhost:8000';

    constructor(private http: HttpClient) {}

    getStrains(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(
            this.url + '/strain/collection/'
        );
    }

    getStrainCollection(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(
            this.url + '/strain/collection/'
        );
    }
    getStrainRequests(): Observable<{ requests: StrainRequest[] }> {
        return this.http.get<{ requests: StrainRequest[] }>(
            this.url + '/strain/requests/'
        );
    }

    getStrainDeposits(): Observable<{ deposits: StrainDeposit[] }> {
        return this.http.get<{ deposits: StrainDeposit[] }>(
            this.url + '/strain/deposits/'
        );
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

    postStrainDeposit(deposit: StrainDeposit): Observable<void> {
        // format the post into an http body
        return this.http.post<void>(this.url + '/strain-deposit', deposit);
    }

    getStrainsPerProvince(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/strains-per-province`);
    }
    getStrainsPerTaxonomicLevel(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/strains-per-taxonomic-level`);
    }
}
