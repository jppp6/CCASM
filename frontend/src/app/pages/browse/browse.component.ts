import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { StrainDetailsDialog } from 'src/app/components/strain-details/strain-details.component';
import { CCASMService } from 'src/app/core/services/ccasm.services';
import { Strain, StrainNode } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  constructor(public dialog: MatDialog, private ccasmService: CCASMService) { }

  treeControl = new NestedTreeControl<StrainNode>((node) => node.children);
  treeDataSource = new MatTreeNestedDataSource<StrainNode>();

  searchType: 'simple' | 'complex' = 'simple';

  filteredStrains: Strain[] | null = null;
  allStrains: Strain[] = [];

  simpleOptions: string[] = [];
  complexOptions: {
    binomialClassification: string[];
    isolationProvince: string[];
    isolationSource: string[];
    isolationSoilTexture: string[];
    riskGroup: string[];
    isolationProtocol: string[];
  } = {
      binomialClassification: [],
      isolationProvince: [],
      isolationSource: [],
      isolationSoilTexture: [],
      riskGroup: [],
      isolationProtocol: [],
    };

  ngOnInit(): void {
    this.ccasmService.getStrains().subscribe((strains) => {
      this.allStrains = Utils.snackCaseToCamelCase(strains.strains) as Strain[];

      this.treeDataSource.data = this.buildTree(
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
          this.allStrains.map((s) => s.riskGroup.toString())
        ),
        isolationProvince: Utils.filterDuplicatesAndFalsy(
          this.allStrains.map((s) => s.isolationProvince)
        ),
        isolationSoilTexture: Utils.filterDuplicatesAndFalsy(
          this.allStrains.map((s) => s.isolationSoilTexture)
        ),
        isolationProtocol: Utils.filterDuplicatesAndFalsy(
          this.allStrains.map((s) => s.isolationProtocol)
        ),
      };
    })
  }

  simpleSearch(searchString: string): void {
    searchString = searchString.toLowerCase();
    if (searchString === '') {
      this.filteredStrains = null;
    } else {
      this.filteredStrains = this.allStrains.filter((s) =>
        s.binomialClassification.toLowerCase().includes(searchString)
      );
    }
  }

  complexSearch(searchParams: { [key: string]: string }): void {
    this.filteredStrains = this.allStrains.filter((s) =>
      Object.keys(searchParams).every((key) =>
        (s as any)[key].toString().toLowerCase().includes(searchParams[key])
      )
    );
  }

  exportFiltered(): void {
    if (this.filteredStrains && this.filteredStrains.length > 0) {
      Utils.exportToCSV(
        this.filteredStrains,
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

  clearResults(): void {
    this.filteredStrains = null;
  }

  openStrainInformation(strain: Strain): void {
    this.dialog.open(StrainDetailsDialog, {
      width: '600px',
      data: strain,
    });
  }

  buildTree(data: string[]): StrainNode[] {
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
          currentNode = child ? child : this.addChild(currentNode, p);
        }
      });
    });
    return nodes;
  }

  addChild(node: StrainNode, childName: string): StrainNode {
    const child: StrainNode = { name: childName, children: [] };
    node.children.push(child);
    return child;
  }

  hasChild = (_: number, n: StrainNode): boolean =>
    !!n.children && n.children.length > 0;

  recursiveCount(n: StrainNode): number {
    return n.children.length > 0
      ? n.children.reduce((c, i) => c + this.recursiveCount(i), 0)
      : 1;
  }
}
