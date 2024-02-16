import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.css'],
})
export class SimpleSearchComponent implements OnInit {
  @Input() options: string[] = [];
  @Output() searchString = new EventEmitter<string>();
  simpleSearch = new FormControl<string>('');
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.simpleSearch.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(v: string): string[] {
    const filterValue = v.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  search() {
    if (this.simpleSearch.value) {
      this.searchString.emit(this.simpleSearch.value);
    }
  }
}
