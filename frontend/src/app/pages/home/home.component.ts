import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
    map!: L.Map;

    constructor(private ccasmService: CCASMService, public dialog: MatDialog) {}

    ngAfterViewInit(): void {
        this.initializeMap();

        this.ccasmService.getCollection().subscribe((result) => {
            this.addCircularMarkers(
                Utils.snackCaseToCamelCase(result.strains) as Strain[]
            );
        });
    }

    // Initialize the leaflet map
    initializeMap(): void {
        // Starting location and zoom
        const startingCoordinates: L.LatLngExpression = [57, -90];
        const startingZoom: number = 4;

        // Google maps layers string
        const googleLayerString: string =
            'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';

        // Map options
        const options: L.TileLayerOptions = {
            maxZoom: 9,
            minZoom: 3,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Built using Google Maps',
        };

        // Initialize the map
        this.map = L.map('home-map').setView(startingCoordinates, startingZoom);

        // Add the Google maps tile to the map
        const tiles: L.TileLayer = L.tileLayer(googleLayerString, options);
        tiles.addTo(this.map);
    }

    // Iterate over the Strain collection and add a marker to the map for each
    addCircularMarkers(strains: Strain[]): void {
        strains.forEach((s: Strain) => {
            if (!s.latitude || !s.longitude) {
                return;
            }

            const marker = L.circleMarker(
                // TODO FLIP BACK
                { lat: s.latitude, lng: s.longitude },
                { radius: 15 }
            );

            marker.on('click', () => {
                // Open Strain details
                this.dialog.open(StrainDetailsDialog, {
                    width: '600px',
                    data: s,
                });
            });

            marker.addTo(this.map);
        });
    }
}
