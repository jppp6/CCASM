import { Strain } from './ccasm.types';

export class Utils {
    static snackCaseToCamelCase(input: any): any {
        if (
            typeof input !== 'object' ||
            input === null ||
            input instanceof Date
        ) {
            return input; // return as is if not an object
        }

        if (Array.isArray(input)) {
            return input.map((item) => this.snackCaseToCamelCase(item)); // handle arrays
        } else {
            const camelCasedObject: any = {};
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
                        letter.toUpperCase()
                    );
                    camelCasedObject[camelCaseKey] = this.snackCaseToCamelCase(
                        input[key]
                    );
                }
            }
            return camelCasedObject;
        }
    }
    static camelCaseToSnakeCase(input: any): any {
        if (
            typeof input !== 'object' ||
            input === null ||
            input instanceof Date
        ) {
            return input; // return as is if not an object
        }

        if (Array.isArray(input)) {
            return input.map((item) => this.camelCaseToSnakeCase(item)); // handle arrays
        } else {
            const snakeCasedObject: any = {};
            for (const key in input) {
                if (Object.prototype.hasOwnProperty.call(input, key)) {
                    const snakeCaseKey = key.replace(
                        /[A-Z]/g,
                        (match) => '_' + match.toLowerCase()
                    );
                    const snakeCaseValue = this.camelCaseToSnakeCase(
                        input[key]
                    );
                    snakeCasedObject[snakeCaseKey] = snakeCaseValue;
                }
            }
            return snakeCasedObject;
        }
    }

    static filterDuplicatesAndFalsy(values: string[]): string[] {
        return values
            .filter((v, i) => values.indexOf(v) === i)
            .filter((v) => !!v);
    }

    static exportToCSV(data: Strain[], filename: string): void {
        if (!data || data.length === 0) {
            return;
        }

        const keys = Object.keys(data[0]);
        let csvContent = keys.join(',') + '\n';

        data.forEach((d) => {
            csvContent += Object.values(d).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    static formatDate(date: Date): string {
        const year = date.getFullYear().toString();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    static getProvinceAbbreviations(): string[] {
        return [
            'AB',
            'BC',
            'MB',
            'NB',
            'NL',
            'NS',
            'NT',
            'NU',
            'ON',
            'PE',
            'QC',
            'SK',
            'YT',
        ];
    }
}
