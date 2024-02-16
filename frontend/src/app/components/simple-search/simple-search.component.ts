import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.css'],
})
export class SimpleSearchComponent {
  simpleSearch = new FormControl<string>('', [Validators.required]);
  options: string[] = ['Bacteria 1', 'bacteria 2', 'bacteria 3'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.simpleSearch.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  print(): void {
    console.log(this.simpleSearch.value);
  }
}
