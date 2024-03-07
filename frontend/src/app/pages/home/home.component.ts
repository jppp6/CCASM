import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { StrainDetailsDialog } from 'src/app/components/strain-details/strain-details.component';
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

  constructor(
    private ccasmService: CCASMService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.ccasmService.getStrains().subscribe((result) => {
      this.initializeMap();
      this.addCircularMarkers(Utils.snackCaseToCamelCase(result.strains) as Strain[]);
    })
  }

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
    this.map = L.map('map').setView(startingCoordinates, startingZoom);

    // Add the Google maps tile to the map
    const tiles: L.TileLayer = L.tileLayer(googleLayerString, options);
    tiles.addTo(this.map);
  }

  addCircularMarkers(strains: Strain[]): void {
    strains.forEach((s) => {
      if (!s.latitude || !s.longitude) {
        return;
      }

      const marker = L.circleMarker(
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
