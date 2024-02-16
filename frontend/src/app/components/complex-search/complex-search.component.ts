import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-complex-search',
  templateUrl: './complex-search.component.html',
  styleUrls: ['./complex-search.component.css'],
})
export class ComplexSearchComponent {
  complexSearchForm = new FormGroup({
    strainName: new FormControl<string>(''),
    province: new FormControl<string>(''),
    isolationSource: new FormControl<string>(''),
    isolationSoilTexture: new FormControl<string>(''),
    riskGroup: new FormControl<string>(''),
    isolationProtocol: new FormControl<string>(''),
    isPlantPathogen: new FormControl<string>(''),
  });

  print(): void {
    console.log(this.complexSearchForm.value);
  }

  clearSearch(): void {
    this.complexSearchForm.reset();
  }

  search(): void {
    const filteredSearchVals = Object.entries({
      ...this.complexSearchForm.value,
    })
      .filter(([_, value]) => !!value) // Filter out truthy values
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: any });

    console.log(filteredSearchVals);
  }
}
