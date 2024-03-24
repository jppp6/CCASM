import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';

export interface ProvinceData {
    strainCount: number;
    isolationSoilProvince: string;
}

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
    map!: L.Map;
    subscriptions: Subscription[] = [];
    provincePieChartOption: EChartsOption | null = null; // Chart option
    provinceBarMekkoChartOption: EChartsOption | null = null; // Chart option
    //taxonomicLevelChartOption: EChartsOption | null = null;
    allProvinceData: ProvinceData[] = []; // Holds the complete province data from the server

    constructor(private ccasmService: CCASMService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.getProvinceData();
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    getProvinceData(): void {
        this.subscriptions.push(
            this.ccasmService.getStrainsPerProvince().subscribe(
                (data) => {
                    this.allProvinceData = Utils.snackCaseToCamelCase(
                        data.provinces
                    ) as ProvinceData[];
                    this.updateCharts();
                },
                (error) => {
                    console.error('Error fetching strains per province', error);
                }
            )
        );
    }

    updateCharts(): void {
        this.provincePieChartOption = this.getProvincePieChartOption(
            this.allProvinceData
        );
        this.provinceBarMekkoChartOption = this.getProvinceBarMekkoChartOption(
            this.allProvinceData
        );
    }

    getProvincePieChartOption(data: ProvinceData[]): EChartsOption {
        // Extract only the data for the selected provinces or all if none are selected
        return {
            title: {
                text: 'Strains Distribution by Province',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: 'Provinces',
                    type: 'pie',
                    radius: '50%',
                    data: this.allProvinceData.map((item) => ({
                        value: item.strainCount,
                        name: item.isolationSoilProvince,
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
    }

    getProvinceBarMekkoChartOption(data: ProvinceData[]): EChartsOption {
        return {
            title: {
                text: 'Strains Distribution by Province',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
            },
            xAxis: {
                type: 'category',
                data: this.allProvinceData.map(
                    (item) => item.isolationSoilProvince
                ),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: this.allProvinceData.map((item) => item.strainCount),
                    type: 'bar',
                },
            ],
        };
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
            this.addCircularMarkers(
                Utils.snackCaseToCamelCase(result.strains) as Strain[]
            );
            console.log(result);
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
            maxZoom: 9,
            minZoom: 3,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Built using Google Maps',
        };

        // Initialize the map
        this.map = L.map('statistics-map').setView(
            startingCoordinates,
            startingZoom
        );

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
            console.log(marker);

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
