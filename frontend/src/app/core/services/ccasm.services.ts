import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProvinceData } from 'src/app/pages/statistics/statistics.component';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';

@Injectable({
    providedIn: 'root',
})
export class CCASMService {
    // Make sure to change this to the Domain name when deployed
    readonly url = 'http://localhost:8000';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.url + '/login/', {
            username: username,
            password: password,
        });
    }

    // GENERAL USER
    getCollection(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(
            this.url + '/api/collection/'
        );
    }

    postDeposit(deposit: StrainDeposit): Observable<void> {
        // format the post into an http body
        return this.http.post<void>(this.url + '/api//deposit/', deposit);
    }

    postRequest(request: StrainRequest): Observable<void> {
        // format the post into an http body
        return this.http.post<void>(this.url + '/api/request/', request);
    }

    // ADMIN USER
    adminGetCollection(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(
            this.url + '/api/admin/collection/'
        );
    }

    adminAddStrain(strain: Strain): Observable<void> {
        return this.http.post<void>(
            this.url + '/api/admin/add-strain/',
            strain
        );
    }

    adminAddStrains(strains: Strain[]): Observable<void> {
        return this.http.post<void>(
            this.url + '/api/admin/add-strains/',
            strains
        );
    }

    adminUpdateStrain(strain: Strain): Observable<void> {
        return this.http.post<void>(
            this.url + '/api/admin/update-strain/',
            strain
        );
    }

    adminGetDeposits(): Observable<{ deposits: StrainDeposit[] }> {
        return this.http.get<{ deposits: StrainDeposit[] }>(
            this.url + '/api/admin/deposits/'
        );
    }
    adminUpdateDeposit(deposit: StrainDeposit): Observable<void> {
        return this.http.post<void>(
            this.url + '/api/admin/update-deposit/',
            deposit
        );
    }

    adminGetRequests(): Observable<{ requests: StrainRequest[] }> {
        return this.http.get<{ requests: StrainRequest[] }>(
            this.url + '/api/admin/requests/'
        );
    }
    adminUpdateRequest(deposit: StrainRequest): Observable<void> {
        return this.http.post<void>(
            this.url + '/api/admin/update-request/',
            deposit
        );
    }

    getStrainsPerProvince(): Observable<{ provinces: ProvinceData[] }> {
        return this.http.get<{ provinces: ProvinceData[] }>(
            `${this.url}/strains-per-province`
        );
    }
    getStrainsPerTaxonomicLevel(taxonomicLevel: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/strains-per-taxonomic-level`);
    }
}
