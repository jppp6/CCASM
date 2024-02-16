import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toTitleCase',
})
export class ToTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    } else {
      return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  }
}
