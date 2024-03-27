import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-complex-search',
    templateUrl: './complex-search.component.html',
    styleUrls: ['./complex-search.component.css'],
})
export class ComplexSearchComponent {
    @Input() options!: { [key: string]: string[] };
    @Output() searchStrings = new EventEmitter<{ [key: string]: string }>();

    complexSearchForm = new FormGroup({
        binomialClassification: new FormControl<string>(''),
        isolationSoilProvince: new FormControl<string>(''),
        isolationSource: new FormControl<string>(''),
        isolationSoilTexture: new FormControl<string>(''),
        riskGroup: new FormControl<string>(''),
        isolationProtocol: new FormControl<string>(''),
    });

    bcFiltered = this._createFilteredObservable('binomialClassification');
    iprovFiltered = this._createFilteredObservable('isolationSoilProvince');
    isFiltered = this._createFilteredObservable('isolationSource');
    istFiltered = this._createFilteredObservable('isolationSoilTexture');
    rgFiltered = this._createFilteredObservable('riskGroup');
    iprotFiltered = this._createFilteredObservable('isolationProtocol');

    private _createFilteredObservable(n: string): Observable<string[]> {
        const c = this.complexSearchForm.get(n);
        if (c) {
            return ((this as any)[`${n}Filtered`] = c.valueChanges.pipe(
                startWith(''),
                map((v: string) => this._filter(this.options[n], v))
            ));
        } else {
            return new Observable<string[]>();
        }
    }

    private _filter(options: string[], value: string): string[] {
        const filterValue = value.toLowerCase();
        return options.filter((o) => o.toLowerCase().includes(filterValue));
    }

    search(): void {
        const searchForm = { ...this.complexSearchForm.value };
        const searchParams: { [key: string]: string } = {};

        Object.keys(searchForm).forEach((key) => {
            const value = (searchForm as any)[key];
            if (value && typeof value === 'string') {
                searchParams[key] = value.toLowerCase();
            }
        });

        if (Object.keys(searchParams).length > 0) {
            this.searchStrings.emit(searchParams);
        }
    }

    clearSearch(): void {
        this.complexSearchForm.reset();
    }
}
