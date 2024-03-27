import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { map } from 'rxjs/operators';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';
import { StringLiteral } from 'typescript';

export interface ProvinceData {
    strainCount: number;
    isolationSoilProvince: string;
}

export interface HostPlantData {
  hostPlantSpecies: string;
  strainCount: number;
}

export interface TaxonomicData {
    name: string; // the name of the taxonomic level
    value: number; // the count of strains in this taxonomic level
    children?: TaxonomicData[]; // nested data for hierarchical visualization
}

export interface IsolationProtocolData {
    isolationProtocol: string;
    strainCount: number;
    // children?: IsolationProtocolData[];
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
    provinceBarChartOption: EChartsOption | null = null; // Chart option
    plantPieChartOption: EChartsOption | null = null; // Chart option
    plantBarChartOption: EChartsOption | null = null; // Chart option
    taxonomicTreeChartOption: EChartsOption | null = null;
    // protocolTreemapOption: EChartsOption | null = null;
    // protocolSunburstOption: EChartsOption | null = null;
    // selectedChartType: 'treemap' | 'sunburst' = 'treemap';
    protocolPieChartOption: EChartsOption | null = null;
    allProvinceData: ProvinceData[] = []; // Holds the complete province data from the server
    allHostPlantData: HostPlantData[] = []; // holds all the host plant data
    allIsolationProtocolData: IsolationProtocolData[] = [];
    taxonomicLevels: string[] = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']
    taxonomicData: any = {}; // Store taxonomic data retrieved from backend
    

    constructor(private ccasmService: CCASMService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.getProvinceData();
        this.getHostPlantData();
        // this.getTaxonomicData();
        this.getIsolationProtocolData();
        
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

    getHostPlantData(): void {
      this.subscriptions.push(
          this.ccasmService.getStrainsPerHostPlantSpecies().subscribe(
              (data) => {
                  this.allHostPlantData = Utils.snackCaseToCamelCase(
                      data.plants
                  ) as HostPlantData[];
                  this.updateCharts();
              },
              (error) => {
                  console.error('Error fetching strains host plant data', error);
              }
          )
      );
  }

  /*   getTaxonomicData(): void{
        this.subscriptions.push(
            this.ccasmService.getTaxonomicData().subscribe(
                (data: TaxonomicData[]) => {
                    this.taxonomicTreeChartOption = this.getRadialTreeOption(data);
                },
                (error) => {
                    console.error('Error fetching taxonomic levels', error);
                }
            )
        );
    } */

    getIsolationProtocolData(): void {
      this.subscriptions.push(
          this.ccasmService.getStrainsPerIsolationProtocol().subscribe(
              (data) => {
                  this.allIsolationProtocolData= Utils.snackCaseToCamelCase(
                      data.protocol
                  ) as IsolationProtocolData[];
                  this.updateCharts();
              },
              (error) => {
                  console.error('Error fetching isolation protocol data', error);
              }
          )
      );
  }
    

    updateCharts(): void {
      this.provincePieChartOption = this.getProvincePieChartOption(
          this.allProvinceData
      );
      this.provinceBarChartOption = this.getProvinceBarChartOption(
          this.allProvinceData
      );
      this.plantPieChartOption = this.getPlantPieChartOption(
          this.allHostPlantData
      );
      this.plantBarChartOption = this.getPlantBarChartOption(
        this.allHostPlantData
      );
      /* this.protocolTreemapOption = this.getProtocolTreemapOption(
        this.allIsolationProtocolData
      );
      this.protocolSunburstOption = this.getProtocolSunburstOption(
        this.allIsolationProtocolData
      ); */
      this.protocolPieChartOption = this.getProtocolPieChartOption(
        this.allIsolationProtocolData
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
                formatter: '{a} <br/>{b}: {c} ({d}%)', // Include value in the tooltip
            },
            /* legend: {
                orient: 'horizontal',
                left: 'left',
            }, */
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
    

    getProvinceBarChartOption(data: ProvinceData[]): EChartsOption {
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
                    label: {
                      show: true,
                      formatter: '{c}', // Display value on each bar
                  },
                },
            ],
        };
    }

    getPlantPieChartOption(data: HostPlantData[]): EChartsOption {
      // Extract only the data for the selected provinces or all if none are selected
      return {
          title: {
              text: 'Strains Distribution by Host Plant Species',
              left: 'center',
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)', // Include value in the tooltip
          },
          /* legend: {
              orient: 'horizontal',
              left: 'left',
          }, */
          series: [
              {
                  name: 'Host Plant Species',
                  type: 'pie',
                  radius: '50%',
                  data: this.allHostPlantData.map((item) => ({
                      value: item.strainCount,
                      name: item.hostPlantSpecies,
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

  getPlantBarChartOption(data: HostPlantData[]): EChartsOption {
    return {
        title: {
            text: 'Strains Distribution by Host Plant Species',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        xAxis: {
            type: 'category',
            data: this.allHostPlantData.map(
                (item) => item.hostPlantSpecies
            ),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: this.allHostPlantData.map((item) => item.strainCount),
                type: 'bar',
                label: {
                  show: true,
                  formatter: '{c}', // Display value on each bar
              },
            },
        ],
    };
}

    /* getRadialTreeOption(data: TaxonomicData[]): EChartsOption {
        return {
            title: {
                text: 'Taxonomic Lineage Distribution',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
            },
            series: [
                {
                type: 'tree',
                data: data,
                top: '1%',
                bottom: '1%',
                layout: 'radial',
                symbol: 'emptyCircle',
                symbolSize: 7,
                initialTreeDepth: 3,
                animationDurationUpdate: 750,
                },
            ],
        };
    } */

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


  getProtocolPieChartOption(data: IsolationProtocolData[]): EChartsOption {
    // Extract only the data for the selected provinces or all if none are selected
    return {
        title: {
            text: 'Strains Distribution by Isolation Protocol',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)', // Include value in the tooltip
        },
        /* legend: {
            orient: 'horizontal',
            left: 'left',
        }, */
        series: [
            {
                name: 'Isolation Protocol',
                type: 'pie',
                radius: '50%',
                data: this.allIsolationProtocolData.map((item) => ({
                    value: item.strainCount,
                    name: item.isolationProtocol,
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
  /* getProtocolTreemapOption(data: any): EChartsOption {
    return {
        title: {
          text: 'Strains Distribution by Isolation Protocol',
          left: 'center',
        },
        series: [
            {
                type: 'treemap',
                id: 'echarts-package-size',
                animationDurationUpdate: 1000,
                roam: false,
                nodeClick: undefined,
                data: data.IsolationProtocolData,
                universalTransition: true,
                label: {
                    show: true,
                },
                breadcrumb: {
                    show: false,
                },
            },
        ],
    };
  }

  getProtocolSunburstOption(data: any): EChartsOption {
    return {
        title: {
          text: 'Strains Distribution by Isolation Protocol',
          left: 'center',
        },
        series: [
            {
                type: 'sunburst',
                id: 'echarts-package-size',
                radius: ['20%', '90%'],
                animationDurationUpdate: 1000,
                nodeClick: undefined,
                data: data.IsolationProtocolData.children,
                universalTransition: true,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,.5)',
                },
                label: {
                    show: false,
                },
            },
        ],
    };
  } */

  /* toggleChartType(): void {
    // /* this.selectedChartType = this.selectedChartType === 'treemap' ? 'sunburst' : 'treemap';
    const currentOption = this.selectedChartType === 'treemap' ? this.protocolTreemapOption : this.protocolSunburstOption;
    // this.myChart.setOption(currentOption); */
    // toggle manually if needed (remove timer)
  // } */


// MAP STUFF BELOW
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
