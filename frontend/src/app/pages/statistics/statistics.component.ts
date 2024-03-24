import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import * as L from 'leaflet';
import { EChartsOption } from 'echarts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

interface ProvinceData {
  strainCount: number;
  province: string;
}

interface Strain {
  ccasm_id: number;
  strain_name: string;
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit{
  map!: L.Map;
  subscriptions: Subscription[] = [];
  provincePieChartOption: EChartsOption | null = null;         // Chart option
  provinceBarMekkoChartOption: EChartsOption | null = null; // Chart option
  //taxonomicLevelChartOption: EChartsOption | null = null;
  //strainsPerProvince: any[] = [];
  //strainsPerTaxonomicLevel: any[] = [];
  selectedProvinces: string[] = []; // Will hold the user's province selections
  allProvinceData: any[] = []; // Holds the complete province data from the server

  constructor(
    private ccasmService: CCASMService,
    public dialog: MatDialog,
    private http: HttpClient,
    ) {}

  ngOnInit(): void {
    this.ccasmService.getStrainsPerProvince().subscribe(data => {
      this.provincePieChartOption = this.getProvincePieChartOption(data);
      this.provinceBarMekkoChartOption = this.getProvinceBarMekkoChartOption(data);
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getProvinceData(): void {
    this.subscriptions.push(
      this.ccasmService.getStrainsPerProvince().subscribe(
      data => {
        console.log(data)
        this.allProvinceData = data;
        this.updateCharts();
      },
        error => {
          console.error('Error fetching strains per province', error);
        }
      )
    );
  }

  updateCharts(): void {
    this.provincePieChartOption = this.getProvincePieChartOption(this.allProvinceData);
    this.provinceBarMekkoChartOption = this.getProvinceBarMekkoChartOption(this.allProvinceData);
  }

  getProvincePieChartOption(data: ProvinceData[]): EChartsOption {
    // Extract only the data for the selected provinces or all if none are selected
    const filteredData = this.selectedProvinces.length > 0 
    ? data.filter(d => this.selectedProvinces.includes(d.province))
    : data;

    return {
      title: {
        text: 'Strains Distribution by Province',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [{
        name: 'Provinces',
        type: 'pie',
        radius: '50%',
        data: filteredData.map(item => ({ value: item.strainCount, name: item.province })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  getProvinceBarMekkoChartOption(data: ProvinceData[]): EChartsOption {
    const filteredData = this.selectedProvinces.length > 0 
      ? data.filter(d => this.selectedProvinces.includes(d.province))
      : data;
  
    return {
      title: {
        text: 'Strains Distribution by Province',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: filteredData.map(item => item.province)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.map(item => item.strainCount),
        type: 'bar',
      }]
    };
  };

  onProvinceSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null; // Typecasting to HTMLSelectElement
    if (selectElement) {
      const selectedOptions = Array.from(selectElement.options)
                                  .filter(option => option.selected)
                                  .map(option => option.value);
      this.selectedProvinces = selectedOptions;
      this.updateCharts(); // Assuming you have a method to update the charts based on the selected provinces
    }
    else {
      // Handle the case where the event target is not an HTMLSelectElement
      console.error('Event target is not a select element');
    }
  }


    /**this.subscriptions.push(
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
  }**/

  /**toggleChartType(type: 'province' | 'taxonomic'): void {
    this.chartType = type;
    // Based on the type, call the service to get the correct data and generate the corresponding chart
    if (type === 'province') {
      // Call the service method to get province data and update the chart option with a pie chart
    } else if (type === 'taxonomic') {
      // Call the service method to get taxonomic data and update the chart option with a radial tree
    }
  }**/

  /**getRadialTreeOption(data: any): EChartsOption {
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
  }**/
  
  ngAfterViewInit(): void {
    this.initializeMap();

    this.ccasmService.getCollection().subscribe((result) => {
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