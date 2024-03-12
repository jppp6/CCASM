import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/core/services/statistics.service';
import { MatDialog } from '@angular/material/dialog';
import { StrainDetailsDialog } from 'src/app/components/strain-details/strain-details.component';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import * as L from 'leaflet';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit{
  map!: L.Map;
  strainsPerProvince: any[] = [];
  strainsPerTaxonomicLevel: any[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private ccasmService: CCASMService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.statisticsService.getStrainsPerProvince().subscribe(
      data => {
        this.strainsPerProvince = data;
      },
      error => {
        console.error('Error fetching strains per province', error);
      }
    )

    this.statisticsService.getStrainsPerTaxonomicLevel().subscribe(
      data => {
        this.strainsPerTaxonomicLevel = data;
      },
      error => {
        console.error('Error fetching strains per taxonomic level', error);
      }
    )
  }
  
  ngAfterViewInit(): void {
    this.initializeMap();

    this.ccasmService.getStrains().subscribe((result) => {
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
