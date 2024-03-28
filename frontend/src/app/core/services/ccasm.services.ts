import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HostPlantData,
    IsolationProtocolData,
    ProvinceData,
} from 'src/app/pages/statistics/statistics.component';
import { Strain, StrainDeposit, StrainRequest } from '../utils/ccasm.types';
import { Utils } from '../utils/ccasm.utils';

@Injectable({
    providedIn: 'root',
})
export class CCASMService {
    // Change this to check on build
    dev: boolean = false;
    readonly url = this.dev
        ? 'http://hs-ccasm-d-w01.internal.azure.queensu.ca:8000/api'
        : 'http://localhost:8000/api';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.url + '/login/', {
            username: username,
            password: password,
        });
    }

    refreshToken(token: any): Observable<any> {
        return this.http.post<any>(this.url + '/refreshToken/', { token });
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

    adminAddStrain(strain: any): Observable<{ result: string }> {
        return this.http.post<{ result: string }>(
            this.url + '/admin/add-strain/',
            Utils.camelCaseToSnakeCase(strain)
        );
    }

    adminAddStrains(strains: Strain[]): Observable<{ result: string }> {
        return this.http.post<{ result: string }>(
            this.url + '/admin/add-strains/',
            {
                strains: Utils.camelCaseToSnakeCase(strains),
            }
        );
    }

    adminUpdateStrain(strain: Strain): Observable<void> {
        return this.http.put<void>(
            this.url + '/admin/update-strain/' + strain.ccasmId,
            Utils.camelCaseToSnakeCase(strain)
        );
    }

    adminGetDeposits(): Observable<{ deposits: StrainDeposit[] }> {
        return this.http.get<{ deposits: StrainDeposit[] }>(
            this.url + '/api/admin/deposits/'
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
            this.url + '/api/admin/requests/'
        );
    }

    adminUpdateRequest(request: StrainRequest): Observable<void> {
        return this.http.put<void>(
            this.url + '/admin/update-request/' + request.requestId,
            Utils.camelCaseToSnakeCase(request)
        );
    }

    getStrainsPerProvince(): Observable<{ provinces: ProvinceData[] }> {
        return this.http.get<{ provinces: ProvinceData[] }>(
            `${this.url}/api/strains-per-province`
        );
    }

    getStrainsPerHostPlantSpecies(): Observable<{ plants: HostPlantData[] }> {
        return this.http.get<{ plants: HostPlantData[] }>(
            `${this.url}/api/strains-per-host-plant-species`
        );
    }

    // NEEDED for TAXONOMINC DATA
    /*  getStrainsPerTaxonomicLevel(taxonomicLevel: string): Observable<{ name: TaxonomicData[] }> {
        return this.http.get<{ name: TaxonomicData[] }>(`${this.url}/api/${taxonomicLevel}/`);
    } */

    getStrainsPerIsolationProtocol(): Observable<{
        protocol: IsolationProtocolData[];
    }> {
        return this.http.get<{ protocol: IsolationProtocolData[] }>(
            `${this.url}/api/strains-per-isolation-protocol`
        );
    }
}
