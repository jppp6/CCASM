import {
    AfterViewInit,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { StrainLocation } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

export interface ProvinceData {
    strainCount: number;
    isolationSoilProvince: string;
}

export interface HostPlantData {
    hostPlantSpecies: string;
    strainCount: number;
}

// TODO needs to be fixed
export interface TaxonomicData {
    taxonomicLineage: string; // the name of the taxonomic level
    strainCount: number; // the count of strains in this taxonomic level
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
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
    map!: L.Map;
    subscriptions: Subscription[] = [];
    provincePieChartOption: EChartsOption | null = null; // Chart option
    provinceBarChartOption: EChartsOption | null = null; // Chart option
    plantPieChartOption: EChartsOption | null = null; // Chart option
    plantBarChartOption: EChartsOption | null = null; // Chart option
    taxonomicTreeChartOption: EChartsOption | null = null;
    // taxonomicTreemapOption: EChartsOption | null = null; // NOT NEEDED
    // taxonomicSunburstOption: EChartsOption | null = null; // NOT NEEDED BUT MAYBE IN FUTURE
    // taxonomicPieChartOption: EChartsOption | null = null;
    // selectedChartType: 'treemap' | 'sunburst' = 'treemap';
    protocolPieChartOption: EChartsOption | null = null;
    allProvinceData: ProvinceData[] = []; // Holds the complete province data from the server
    allHostPlantData: HostPlantData[] = []; // holds all the host plant data
    allIsolationProtocolData: IsolationProtocolData[] = [];
    allTaxonomicData: TaxonomicData[] = []; // Store taxonomic data retrieved from backend
    taxonomicLevels: string[] = [
        'Kingdom',
        'Phylum',
        'Class',
        'Order',
        'Family',
        'Genus',
        'Species',
    ];
    private ccasmService = inject(CCASMService);
    public dialog = inject(MatDialog);

    ngAfterViewInit(): void {
        this._initializeMap();
    }

    ngOnInit(): void {
        this.ccasmService.getMap().subscribe((r) => {
            const s = Utils.snackCaseToCamelCase(r.data) as StrainLocation[];
            this.addCircularMarkers(s);
        });
        this.getProvinceData();
        this.getHostPlantData();
        // this.getTaxonomicData();
        this.getIsolationProtocolData();
        // this.getTaxonomicData('kingdom');
        // this.getTaxonomicData('phylum');
        // this.getTaxonomicData('class');
        // this.getTaxonomicData('order');
        // this.getTaxonomicData('family');
        // this.getTaxonomicData('genus');
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    getProvinceData(): void {
        this.subscriptions.push(
            this.ccasmService.getStrainsPerProvince().subscribe(
                (data) => {
                    const allProvinceData = Utils.snackCaseToCamelCase(
                        data.provinces
                    ) as ProvinceData[];
                    this.provincePieChartOption = {
                        title: {
                            text: 'Strains per\nProvince/Territory',
                            left: 'center',
                            top: 'center',
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
                                name: 'Province/Territory',
                                type: 'pie',
                                radius: ['70%', '90%'],
                                data: allProvinceData.map((item) => ({
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
                                label: {
                                    fontSize: 15,
                                },
                            },
                        ],
                    };
                    this.provinceBarChartOption = {
                        title: {
                            text: 'Strains per Province/Territory',
                            left: 'center',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { type: 'shadow' },
                        },
                        xAxis: {
                            type: 'category',
                            data: allProvinceData.map(
                                (item) => item.isolationSoilProvince
                            ),
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [
                            {
                                data: allProvinceData.map(
                                    (item) => item.strainCount
                                ),
                                type: 'bar',
                                label: {
                                    show: true,
                                    formatter: '{c}', // Display value on each bar
                                },
                            },
                        ],
                    };
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
                    const allHostPlantData = Utils.snackCaseToCamelCase(
                        data.plants
                    ) as HostPlantData[];
                    this.plantPieChartOption = {
                        title: {
                            text: 'Strains per\nAssociated Plant',
                            left: 'center',
                            top: 'center',
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
                                radius: ['70%', '90%'],
                                data: allHostPlantData.map((item) => ({
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
                                label: {
                                    fontSize: 15,
                                },
                            },
                        ],
                    };
                    this.plantBarChartOption = {
                        title: {
                            text: 'Strains per Associated Plant',
                            left: 'center',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { type: 'shadow' },
                        },
                        xAxis: {
                            type: 'category',
                            data: allHostPlantData.map(
                                (item) => item.hostPlantSpecies
                            ),
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [
                            {
                                data: allHostPlantData.map(
                                    (item) => item.strainCount
                                ),
                                type: 'bar',
                                label: {
                                    show: true,
                                    formatter: '{c}', // Display value on each bar
                                },
                            },
                        ],
                    };
                },
                (error) => {
                    console.error(
                        'Error fetching strains host plant data',
                        error
                    );
                }
            )
        );
    }

    // GET TAXONOMIC DATA FUNCTION JUST NEEDS SOME PYTHON CHANGES IN VIEWS.PY
    //  getTaxonomicData(taxonomicLevel: string): void{
    //     this.subscriptions.push(
    //         this.ccasmService.getStrainsPerTaxonomicLevel(taxonomicLevel).subscribe(
    //             (data) => {
    //               const allTaxonomicData =
    //                   Utils.snackCaseToCamelCase(
    //                     data.name
    //               ) as TaxonomicData[]
    //               this.taxonomicPieChartOption = {
    //                 title: {
    //                   text: `Strains Distribution by ${taxonomicLevel} Taxonomy`,
    //                   left: 'center',
    //                 },
    //                 tooltip: {
    //                     trigger: 'item',
    //                     formatter: '{a} <br/>{b}: {c} ({d}%)', // Include value in the tooltip
    //                 },
    //                 /* legend: {
    //                     orient: 'horizontal',
    //                     left: 'left',
    //                 }, */
    //                 series: [
    //                     {
    //                         name: `${taxonomicLevel} Taxonomy`,
    //                         type: 'pie',
    //                         radius: '50%',
    //                         data: allTaxonomicData.map((item) => ({
    //                             value: item.strainCount,
    //                             name: item.taxonomicLineage,
    //                         })),
    //                         emphasis: {
    //                             itemStyle: {
    //                                 shadowBlur: 10,
    //                                 shadowOffsetX: 0,
    //                                 shadowColor: 'rgba(0, 0, 0, 0.5)',
    //                             },
    //                         },
    //                     },
    //                 ],
    //               };
    //             },
    //             (error) => {
    //                 console.error('Error fetching taxonomic levels', error);
    //             }
    //         )
    //     );
    // }

    getIsolationProtocolData(): void {
        this.subscriptions.push(
            this.ccasmService.getStrainsPerIsolationProtocol().subscribe(
                (data) => {
                    const allIsolationProtocolData = Utils.snackCaseToCamelCase(
                        data.protocol
                    ) as IsolationProtocolData[];
                    this.protocolPieChartOption = {
                        title: {
                            text: 'Strains per\nIsolation Protocol',
                            left: 'center',
                            top: 'center',
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
                                radius: ['70%', '90%'],
                                data: allIsolationProtocolData.map((item) => ({
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
                                label: {
                                    fontSize: 15,
                                },
                            },
                        ],
                    };
                },
                (error) => {
                    console.error(
                        'Error fetching isolation protocol data',
                        error
                    );
                }
            )
        );
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

    /*  getTaxonomicTreemapOption(data: TaxonomicData, taxonomicLevel: string): EChartsOption {
    return {
        title: {
          text: `Strains Distribution by ${taxonomicLevel} Taxonomy`,
          left: 'center',
        },
        series: [
            {
                type: 'treemap',
                id: 'echarts-package-size',
                animationDurationUpdate: 1000,
                roam: false,
                nodeClick: undefined,
                data: data.name,
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
 */
    /*  getTaxonomicSunburstOption(data: TaxonomicData): EChartsOption {
    return {
        title: {
          text: `Strains Distribution by Taxonomy`,
          left: 'center',
        },
        series: [
            {
                type: 'sunburst',
                id: 'echarts-package-size',
                radius: ['20%', '90%'],
                animationDurationUpdate: 1000,
                nodeClick: undefined,
                data: data,
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

    /* setInterval(() => {
        this.currentOption =
            this.currentOption === treemapOption ? sunburstOption : treemapOption;
    }, 3000);
 */

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
        this.map = L.map('statistics-map').setView(
            startingCoordinates,
            startingZoom
        );

        // Add the Google maps tile to the map
        const tiles: L.TileLayer = L.tileLayer(googleLayerString, options);
        tiles.addTo(this.map);
    }

    addCircularMarkers(strains: StrainLocation[]): void {
        strains.forEach((s) => {
            if (!s.latitude || !s.longitude) {
                return;
            }

            const marker = L.circleMarker(
                { lat: s.latitude, lng: s.longitude },
                { radius: 5 }
            );

            marker.addTo(this.map);
        });
    }
}
