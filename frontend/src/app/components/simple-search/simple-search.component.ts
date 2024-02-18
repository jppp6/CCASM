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
  @Input() options: string[] = [];

  simpleSearch = new FormControl<string>('');
  filteredOptions: Observable<string[]> = this._createFilteredObservable();

  private _createFilteredObservable(): Observable<string[]> {
    return this.simpleSearch.valueChanges.pipe(
      startWith(''),
      map((v) => this._filter(v || ''))
    );
  }

  private _filter(v: string): string[] {
    v = v.toLowerCase();
    return this.options.filter((o) => o.toLowerCase().includes(v));
  }

  search() {
    if (this.simpleSearch.value) {
      this.searchString.emit(this.simpleSearch.value.toLowerCase());
    }
  }
}
