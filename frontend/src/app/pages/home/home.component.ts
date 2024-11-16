import { AfterViewInit, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
    map!: L.Map;
    fromProv = {
        AB: 0,
        BC: 0,
        MB: 0,
        NB: 0,
        NL: 0,
        NS: 0,
        NT: 0,
        NU: 0,
        ON: 0,
        PE: 0,
        QC: 0,
        SK: 0,
        YT: 0,
        ALL: 0,
    };
    private ccasmService = inject(CCASMService);
    public dialog = inject(MatDialog);

    ngAfterViewInit(): void {
        this._initializeMap();
        this.ccasmService.getCollection().subscribe((result) => {
            this.addCircularMarkers(
                Utils.snackCaseToCamelCase(result.strains) as Strain[]
            );
        });
    }

    // Initialize the leaflet map
    private _initializeMap(): void {
        // Starting location and zoom
        const startingCoordinates: L.LatLngExpression = [54, -90];
        const startingZoom: number = 4;

        // Google maps layers string
        const googleLayerString: string =
            'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';

        // Map options
        const options: L.TileLayerOptions = {
            maxZoom: 6,
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

    addCircularMarkers(strains: Strain[]): void {
        strains.forEach((s: Strain) => {
            if (!s.latitude || !s.longitude) {
                return;
            }
            // Make and add circle
            L.circleMarker(
                { lat: s.latitude, lng: s.longitude },
                { radius: 5 }
            ).addTo(this.map);

            // Adds strain to provincial stats
            if (this.fromProv[s.isolationSoilProvince] !== undefined) {
                this.fromProv[s.isolationSoilProvince]++;
                this.fromProv['ALL']++;
            }
        });
    }
}
