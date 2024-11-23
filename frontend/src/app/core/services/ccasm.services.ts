import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HostPlantData,
    IsolationProtocolData,
    ProvinceData,
} from 'src/app/pages/statistics/statistics.component';
import {
    Strain,
    StrainDeposit,
    StrainLocation,
    StrainRequest,
} from '../utils/ccasm.types';
import { Utils } from '../utils/ccasm.utils';

@Injectable({
    providedIn: 'root',
})
export class CCASMService {
    // Test for goodluck Change this to check on build
    prod: boolean = true;
    readonly url = this.prod
        ? 'http://hs-ccasm-p-w01.internal.azure.queensu.ca:8000/api'
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
    getMap(): Observable<{ data: StrainLocation[] }> {
        return this.http.get<{ data: StrainLocation[] }>(this.url + '/map/');
    }

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

    adminAddStrain(strain: any): Observable<{ result: string }> {
        return this.http.post<{ result: string }>(
            this.url + '/admin/add-strain/',
            Utils.camelCaseToSnakeCase(strain)
        );
    }

    adminUpdateStrain(s: Strain): Observable<{ status: boolean }> {
        return this.http.put<{ status: boolean }>(
            this.url + '/admin/update-strain/' + s.strainId,
            Utils.camelCaseToSnakeCase(s)
        );
    }

    adminDeleteStrain(strain: Strain): Observable<{ status: boolean }> {
        return this.http.delete<{ status: boolean }>(
            this.url + '/admin/delete-strain/' + strain.strainId
        );
    }

    adminGetDeposits(): Observable<{ deposits: StrainDeposit[] }> {
        return this.http.get<{ deposits: StrainDeposit[] }>(
            this.url + '/admin/deposits/'
        );
    }

    adminUpdateDeposit(d: StrainDeposit): Observable<{ status: boolean }> {
        return this.http.put<{ status: boolean }>(
            this.url + '/admin/update-deposit/' + d.depositId,
            Utils.camelCaseToSnakeCase(d)
        );
    }

    adminDeleteDeposit(
        deposit: StrainDeposit
    ): Observable<{ status: boolean }> {
        return this.http.delete<{ status: boolean }>(
            this.url + '/admin/delete-deposit/' + deposit.depositId
        );
    }

    adminGetRequests(): Observable<{ requests: StrainRequest[] }> {
        return this.http.get<{ requests: StrainRequest[] }>(
            this.url + '/admin/requests/'
        );
    }

    adminUpdateRequest(r: StrainRequest): Observable<{ status: boolean }> {
        return this.http.put<{ status: boolean }>(
            this.url + '/admin/update-request/' + r.requestId,
            Utils.camelCaseToSnakeCase(r)
        );
    }

    adminDeleteRequest(
        request: StrainRequest
    ): Observable<{ status: boolean }> {
        return this.http.delete<{ status: boolean }>(
            this.url + '/admin/delete-request/' + request.requestId
        );
    }

    getStrainsPerProvince(): Observable<{ provinces: ProvinceData[] }> {
        return this.http.get<{ provinces: ProvinceData[] }>(
            `${this.url}/strains-per-province`
        );
    }

    getStrainsPerHostPlantSpecies(): Observable<{ plants: HostPlantData[] }> {
        return this.http.get<{ plants: HostPlantData[] }>(
            `${this.url}/strains-per-host-plant-species`
        );
    }

    // NEEDED for TAXONOMINC DATA
    /*  getStrainsPerTaxonomicLevel(taxonomicLevel: string): Observable<{ name: TaxonomicData[] }> {
        return this.http.get<{ name: TaxonomicData[] }>(`${this.url}/${taxonomicLevel}/`);
    } */

    getStrainsPerIsolationProtocol(): Observable<{
        protocol: IsolationProtocolData[];
    }> {
        return this.http.get<{ protocol: IsolationProtocolData[] }>(
            `${this.url}/strains-per-isolation-protocol`
        );
    }
}
