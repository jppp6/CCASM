import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-complex-search',
    templateUrl: './complex-search.component.html',
    styleUrls: ['./complex-search.component.css'],
})
export class ComplexSearchComponent {
    @Input({ required: true }) options: {
        binomialClassification: string[];
        isolationSoilProvince: string[];
        hostPlantSpecies: string[];
    } = {
        binomialClassification: [],
        isolationSoilProvince: [],
        hostPlantSpecies: [],
    };

    @Output() searchStrings = new EventEmitter<{
        binomialClassification: string;
        isolationSoilProvince: string;
        ccasmId: string;
        taxonomicLineage: string;
        hostPlantSpecies: string;
        strainName: string;
    }>();

    // FormGroup to manage the form
    complexSearchForm = new FormGroup({
        binomialClassification: new FormControl<string>(''),
        isolationSoilProvince: new FormControl<string>(''),
        ccasmId: new FormControl<string>(''),
        taxonomicLineage: new FormControl<string>(''),
        hostPlantSpecies: new FormControl<string>(''),
        strainName: new FormControl<string>(''),
    });

    // Observable filters for dropdowns
    bcFiltered: Observable<string[]>;
    iprovFiltered: Observable<string[]>;
    apsFiltered: Observable<string[]>;

    constructor() {
        this.bcFiltered = this.complexSearchForm
            .get('binomialClassification')!
            .valueChanges.pipe(
                startWith(''),
                map((value: string | null) =>
                    this._filter(
                        this.options.binomialClassification,
                        value || ''
                    )
                )
            );

        this.iprovFiltered = this.complexSearchForm
            .get('isolationSoilProvince')!
            .valueChanges.pipe(
                startWith(''),
                map((value: string | null) =>
                    this._filter(
                        this.options.isolationSoilProvince,
                        value || ''
                    )
                )
            );

        this.apsFiltered = this.complexSearchForm
            .get('hostPlantSpecies')!
            .valueChanges.pipe(
                startWith(''),
                map((value: string | null) =>
                    this._filter(this.options.hostPlantSpecies, value || '')
                )
            );
    }

    // Utility method to filter options
    private _filter(options: string[], value: string): string[] {
        const filterValue = value.toLowerCase();
        return options.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    // Trigger search with current form values
    search(): void {
        this.searchStrings.emit({
            binomialClassification: (
                this.complexSearchForm.value.binomialClassification || ''
            ).toLocaleLowerCase(),
            isolationSoilProvince: (
                this.complexSearchForm.value.isolationSoilProvince || ''
            ).toLocaleLowerCase(),
            ccasmId: (
                this.complexSearchForm.value.ccasmId || ''
            ).toLocaleLowerCase(),
            taxonomicLineage: (
                this.complexSearchForm.value.taxonomicLineage || ''
            ).toLocaleLowerCase(),
            hostPlantSpecies: (
                this.complexSearchForm.value.hostPlantSpecies || ''
            ).toLocaleLowerCase(),
            strainName: (
                this.complexSearchForm.value.strainName || ''
            ).toLocaleLowerCase(),
        });
    }

    // Reset the form and all filters
    clearSearch(): void {
        this.complexSearchForm.reset();
    }
}
