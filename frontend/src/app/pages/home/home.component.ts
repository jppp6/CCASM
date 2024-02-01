import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  map!: L.Map;

  constructor(private ccasmService: CCASMService) {}

  ngAfterViewInit(): void {
    this.initializeMap();

    this.ccasmService.getStrains().subscribe((strains) => {
      this.addCircularMarkers(strains);
    });
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
      maxZoom: 6,
      minZoom: 3,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    };

    // Initialize the map
    this.map = L.map('map').setView(startingCoordinates, startingZoom);

    // Add the Google maps tile to the map
    const tiles: L.TileLayer = L.tileLayer(googleLayerString, options);
    tiles.addTo(this.map);
  }

  addCircularMarkers(strains: Strain[]): void {
    strains.forEach((strain) => {
      const marker = L.circleMarker([44.2329329, -76.5153151], {
        radius: 25,
      });

      // change to reroute to search page
      marker.on('click', () => {});

      marker.addTo(this.map);
    });
  }
}
