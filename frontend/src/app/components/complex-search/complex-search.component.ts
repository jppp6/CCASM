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
  @Output() searchStrings = new EventEmitter<{
    [key: string]: string | null;
  }>();

  complexSearchForm = new FormGroup({
    binomialClassification: new FormControl<string>(''),
    isolationProvince: new FormControl<string>(''),
    isolationSource: new FormControl<string>(''),
    isolationSoilTexture: new FormControl<string>(''),
    riskGroup: new FormControl<string>(''),
    isolationProtocol: new FormControl<string>(''),
    isPlantPathogen: new FormControl<string>(''),
  });

  bcFiltered = this.createFilteredObservable('binomialClassification');
  iprovFiltered = this.createFilteredObservable('isolationProvince');
  isFiltered = this.createFilteredObservable('isolationSource');
  istFiltered = this.createFilteredObservable('isolationSoilTexture');
  rgFiltered = this.createFilteredObservable('riskGroup');
  iprotFiltered = this.createFilteredObservable('isolationProtocol');

  private createFilteredObservable(controlName: string): Observable<string[]> {
    const c = this.complexSearchForm.get(controlName);
    if (c) {
      return ((this as any)[`${controlName}Filtered`] = c.valueChanges.pipe(
        startWith(''),
        map((v) => this._filter(this.options[controlName], v || ''))
      ));
    } else {
      return new Observable();
    }
  }

  private _filter(options: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(filterValue));
  }

  clearSearch(): void {
    this.complexSearchForm.reset();
  }

  search(): void {
    this.searchStrings.emit(this.complexSearchForm.value);
  }
}
