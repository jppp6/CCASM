import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain, StrainNode } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
import { StrainDetailsDialog } from 'src/app/pages/browse/strain-details/strain-details.component';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
    constructor(public dialog: MatDialog, private ccasmService: CCASMService) {}

    treeControl = new NestedTreeControl<StrainNode>((node) => node.children);
    treeDataSource = new MatTreeNestedDataSource<StrainNode>();
    showTree: boolean = true;
    allStrains: Strain[] = [];

    filteredStrains: MatTableDataSource<Strain> =
        new MatTableDataSource<Strain>([]);
    obs: Observable<Strain[]> = new Observable<Strain[]>();
    @ViewChild(MatPaginator) paginator!: MatPaginator; // Initialize paginator

    searchType: 'simple' | 'complex' = 'simple';

    simpleOptions: string[] = [];
    complexOptions: {
        binomialClassification: string[];
        isolationSoilProvince: string[];
        isolationSource: string[];
        isolationSoilTexture: string[];
        riskGroup: string[];
        isolationProtocol: string[];
    } = {
        binomialClassification: [],
        isolationSoilProvince: [],
        isolationSource: [],
        isolationSoilTexture: [],
        riskGroup: [],
        isolationProtocol: [],
    };

    ngOnInit(): void {
        this.ccasmService.getCollection().subscribe((r) => {
            this.allStrains = Utils.snackCaseToCamelCase(r.strains) as Strain[];

            this.treeDataSource.data = this._buildTree(
                this.allStrains.map((s) => s.taxonomicLineage)
            );

            this.simpleOptions = Utils.filterDuplicatesAndFalsy(
                this.allStrains.map((s) => s.binomialClassification)
            );

            this.complexOptions = {
                binomialClassification: this.simpleOptions,
                isolationSource: Utils.filterDuplicatesAndFalsy(
                    this.allStrains.map((s) => s.isolationSource)
                ),
                riskGroup: Utils.filterDuplicatesAndFalsy(
                    this.allStrains.map((s) => (s.riskGroup || '').toString())
                ),
                isolationSoilProvince: Utils.filterDuplicatesAndFalsy(
                    this.allStrains.map((s) => s.isolationSoilProvince)
                ),
                isolationSoilTexture: Utils.filterDuplicatesAndFalsy(
                    this.allStrains.map((s) => s.isolationSoilTexture)
                ),
                isolationProtocol: Utils.filterDuplicatesAndFalsy(
                    this.allStrains.map((s) => s.isolationProtocol)
                ),
            };
            this.filteredStrains.data = [];
            this.filteredStrains.paginator = this.paginator;
            this.obs = this.filteredStrains.connect();
        });
    }

    simpleSearch(searchString: string): void {
        searchString = searchString.replace('unclassified ', '');
        this.filteredStrains.data =
            searchString !== ''
                ? this.allStrains.filter((s) =>
                      s.binomialClassification
                          .toLowerCase()
                          .includes(searchString)
                  )
                : [];
        this.showTree = false;
    }

    complexSearch(searchParams: { [key: string]: string }): void {
        this.filteredStrains.data = this.allStrains.filter((s) =>
            Object.keys(searchParams).every((key) =>
                ((s as any)[key] || '')
                    .toString()
                    .toLowerCase()
                    .includes(searchParams[key])
            )
        );
        this.showTree = false;
    }

    exportFiltered(): void {
        if (this.filteredStrains.data.length > 0) {
            Utils.exportToCSV(
                this.filteredStrains.data,
                'CCASM-' + Utils.formatDate(new Date()) + '.csv'
            );
        }
    }

    exportAll(): void {
        if (this.allStrains.length > 0) {
            Utils.exportToCSV(
                this.allStrains,
                'CCASM-' + Utils.formatDate(new Date()) + '.csv'
            );
        }
    }

    openStrainInformation(strain: Strain): void {
        this.dialog.open(StrainDetailsDialog, {
            width: '600px',
            data: strain,
        });
    }

    private _buildTree(data: string[]): StrainNode[] {
        const nodes: StrainNode[] = [];

        data.forEach((entry) => {
            let currentNode: StrainNode | undefined = undefined;

            const parts = entry.split('; ');
            parts.forEach((p) => {
                if (!currentNode) {
                    const existingNode = nodes.find((node) => node.name === p);
                    if (!existingNode) {
                        currentNode = { name: p, children: [] };
                        nodes.push(currentNode);
                    } else {
                        currentNode = existingNode;
                    }
                } else {
                    const child = currentNode.children.find(
                        (c: StrainNode) => c.name === p
                    );
                    currentNode = child
                        ? child
                        : this._addChild(currentNode, p);
                }
            });
        });
        return nodes;
    }

    private _addChild(node: StrainNode, childName: string): StrainNode {
        const child: StrainNode = { name: childName, children: [] };
        node.children.push(child);
        return child;
    }

    hasChild = (_: number, n: StrainNode): boolean =>
        !!n.children && n.children.length > 0;

    recursiveCount = (n: StrainNode): number =>
        n.children.length > 0
            ? n.children.reduce((c, i) => c + this.recursiveCount(i), 0)
            : 1;
}
