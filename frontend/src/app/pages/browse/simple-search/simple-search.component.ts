import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-simple-search',
    templateUrl: './simple-search.component.html',
    styleUrls: ['./simple-search.component.css'],
})
export class SimpleSearchComponent {
    @Output() searchString = new EventEmitter<string>();
    @Input({ required: true }) options: string[] = [];

    simpleSearch = new FormControl<string>('');
    filteredOptions: Observable<string[]> = this.simpleSearch.valueChanges.pipe(
        startWith(''),
        map((v) => this._filter(v || ''))
    );

    private _filter(v: string): string[] {
        v = v.toLowerCase();
        return this.options.filter((o) => o.toLowerCase().includes(v));
    }

    // Emits to parent component (browse) the search string
    search(): void {
        if (this.simpleSearch.value) {
            this.searchString.emit(this.simpleSearch.value.toLowerCase());
        }
    }
}
