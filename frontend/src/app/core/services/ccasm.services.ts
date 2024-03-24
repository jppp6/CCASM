import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';
import { Utils } from '../utils/ccasm.utils';

@Injectable({
    providedIn: 'root',
})
export class CCASMService {
    // Make sure to change this to the Domain name when deployed
    readonly url = 'http://localhost:8000/api';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.url + '/login/', {
            username: username,
            password: password,
        });
    }

    // GENERAL USER
    getCollection(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(this.url + '/collection/');
    }

    postDeposit(deposit: StrainDeposit): Observable<void> {
        // format the post into an http body
        return this.http.post<void>(this.url + '/deposit/', deposit);
    }

    postRequest(request: StrainRequest): Observable<void> {
        // format the post into an http body
        return this.http.post<void>(this.url + '/request/', request);
    }

    // ADMIN USER
    adminGetCollection(): Observable<{ strains: Strain[] }> {
        return this.http.get<{ strains: Strain[] }>(
            this.url + '/admin/collection/'
        );
    }

    adminAddStrain(strain: any): Observable<void> {
        return this.http.post<void>(
            this.url + '/admin/add-strain/',
            Utils.camelCaseToSnakeCase(strain)
        );
    }

    adminAddStrains(strains: Strain[]): Observable<void> {
        return this.http.post<void>(this.url + '/admin/add-strains/', {
            strains: Utils.camelCaseToSnakeCase(strains),
        });
    }

    adminUpdateStrain(strain: Strain): Observable<void> {
        return this.http.put<void>(
            this.url + '/admin/update-strain/' + strain.ccasmId,
            Utils.camelCaseToSnakeCase(strain)
        );
    }

    adminGetDeposits(): Observable<{ deposits: StrainDeposit[] }> {
        return this.http.get<{ deposits: StrainDeposit[] }>(
            this.url + '/admin/deposits/'
        );
    }
    adminUpdateDeposit(deposit: StrainDeposit): Observable<void> {
        return this.http.put<void>(
            this.url + '/admin/update-deposit/' + deposit.depositId,
            Utils.camelCaseToSnakeCase(deposit)
        );
    }

    adminGetRequests(): Observable<{ requests: StrainRequest[] }> {
        return this.http.get<{ requests: StrainRequest[] }>(
            this.url + '/admin/requests/'
        );
    }

    adminUpdateRequest(request: StrainRequest): Observable<void> {
        return this.http.put<void>(
            this.url + '/admin/update-request/' + request.requestId,
            Utils.camelCaseToSnakeCase(request)
        );
    }
}
