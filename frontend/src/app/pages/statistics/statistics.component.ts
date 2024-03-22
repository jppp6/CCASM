import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import * as L from 'leaflet';
import { EChartsOption } from 'echarts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit{
  map!: L.Map;
  chartOption: EChartsOption | null = null;
  chartType: 'province' | 'taxonomic' = 'province'; // Default chart type
  subscriptions: Subscription[] = [];
  provinceChartOption: EChartsOption | null = null;
  taxonomicLevelChartOption: EChartsOption | null = null;
  strainsPerProvince: any[] = [];
  strainsPerTaxonomicLevel: any[] = [];

  constructor(
    private ccasmService: CCASMService,
    public dialog: MatDialog,
    private http: HttpClient,
    ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.ccasmService.getStrainsPerProvince().subscribe(
      data => {
        if (this.chartType === 'province') {
          this.chartOption = this.getProvinceChartOption(data);
        }
      },
        error => {
          console.error('Error fetching strains per province', error);
        }
      )
    )

    this.subscriptions.push(
      this.ccasmService.getStrainsPerTaxonomicLevel().subscribe(
        data => {
          if (this.chartType === 'taxonomic') {
            this.chartOption = this.getRadialTreeOption(data);
          }
        },
        error => {
          console.error('Error fetching strains per taxonomic level', error);
        }
      )
    )
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleChartType(type: 'province' | 'taxonomic'): void {
    this.chartType = type;
    // Based on the type, call the service to get the correct data and generate the corresponding chart
    if (type === 'province') {
      // Call the service method to get province data and update the chart option with a pie chart
    } else if (type === 'taxonomic') {
      // Call the service method to get taxonomic data and update the chart option with a radial tree
    }
  }

  getProvinceChartOption(data: any): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: data.map((item: { province: any; }) => item.province)
      },
      yAxis: { type: 'value' },
      series: [{
        data: data.map((item: { strainCount: any; }) => item.strainCount),
        type: 'bar'
      }]
    };
  }

  getRadialTreeOption(data: any): EChartsOption {
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [data], // The data needs to be in the correct format
          top: '18%',
          bottom: '14%',
          layout: 'radial',
          symbol: 'emptyCircle',
          symbolSize: 7,
          initialTreeDepth: 3,
          animationDurationUpdate: 750,
        },
      ],
    };
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
    this.map = L.map('statistics-map').setView(startingCoordinates, startingZoom);

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