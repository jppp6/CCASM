import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrainCartService } from 'src/app/core/services/strain-cart.service';
import { Strain } from 'src/app/core/utils/ccasm.types';

@Component({
    selector: 'app-strain-details',
    template: `
        <h2 mat-dialog-title>Strain Information</h2>

        <mat-dialog-content>
            <strong>CCASM ID: </strong>{{ data.ccasmId }}
            <mat-divider></mat-divider>
            <strong>Strain Name: </strong>{{ data.strainName }}
            <mat-divider></mat-divider>
            <strong>Binomial Classification: </strong
            >{{ data.binomialClassification }}
            <mat-divider></mat-divider>
            <strong>Taxonomic Lineage: </strong>{{ data.taxonomicLineage }}
            <mat-divider></mat-divider>
            <strong>Risk Group: </strong>{{ data.riskGroup }}
            <mat-divider></mat-divider>
            <strong>Is Plant Pathogen: </strong>{{ data.isPlantPathogen }}
            <mat-divider></mat-divider>
            <strong>Colony Morphology: </strong>{{ data.colonyMorphology }}
            <mat-divider></mat-divider>
            <strong>Province of Isolation: </strong
            >{{ data.isolationSoilProvince }}
            <mat-divider></mat-divider>
            <strong>Associated Plant Species: </strong
            >{{ data.hostPlantSpecies }}
            <mat-divider></mat-divider>
            <strong>Isolation Source: </strong>{{ data.isolationSource }}
            <mat-divider></mat-divider>
            <strong>Isolation Year: </strong>{{ data.isolationYear }}
            <mat-divider></mat-divider>
            <strong>Isolation Protocol: </strong>{{ data.isolationProtocol }}
            <mat-divider></mat-divider>
            <strong>Isolation Growth Temperature (˚C): </strong
            >{{ data.isolationGrowthTemperature }}
            <mat-divider></mat-divider>
            <strong>Isolation Growth Medium: </strong
            >{{ data.isolationGrowthMedium }}
            <mat-divider></mat-divider>
            <strong>Isolation Growth Medium Composition: </strong
            >{{ data.isolationGrowthMediumComposition }}
            <mat-divider></mat-divider>
            <strong>Isolation Soil pH: </strong>{{ data.isolationSoilPh }}
            <mat-divider></mat-divider>
            <strong>Isolation Soil Organic Matter: </strong
            >{{ data.isolationSoilOrganicMatter }}
            <mat-divider></mat-divider>
            <strong>Isolation Soil Texture: </strong
            >{{ data.isolationSoilTexture }}
            <mat-divider></mat-divider>
            <strong>Genome NCBI Association: </strong
            >{{ data.genomeNcbiAssociation }}
            <mat-divider></mat-divider>
            <strong>Genome Size: </strong>{{ data.genomeSize }}
            <mat-divider></mat-divider>
            <strong>Notes: </strong>{{ data.notes }}
            <mat-divider></mat-divider>
            <strong>Citation: </strong>{{ data.citation }}
            <mat-divider></mat-divider>
            <strong>Image: </strong><img [src]="data.photo ? '/images/' + data.photo : '/images/Placeholder.png'"  alt="Image" style="width:300px; height:300px;">
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button
                mat-button
                mat-dialog-close
                cdkFocusInitial
                (click)="addStrainToCart()"
            >
                Add to Cart
            </button>
        </mat-dialog-actions>
    `,
})
export class StrainDetailsDialog {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Strain,
        private strainCartService: StrainCartService
    ) {}

    addStrainToCart(): void {
        this.strainCartService.addStrainToCart(this.data);
    }
}
