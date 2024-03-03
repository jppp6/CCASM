import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { StrainDetailsDialog } from 'src/app/components/strain-details/strain-details.component';
import { StrainStoreService } from 'src/app/core/services/strain.service';
import { Strain, StrainNode } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private strainStore: StrainStoreService
  ) {}

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
    // change this to get the stuff from DB instead
    this.allStrains = this.strainStore.strains;

    this.treeDataSource.data = this.buildTree(
      this.allStrains.map((s) => s.taxonomicLineage)
    );

    this.simpleOptions = Utils.filterDuplicates(
      this.allStrains.map((s) => s.binomialClassification).filter((s) => !!s)
    );
    this.complexOptions = {
      binomialClassification: this.simpleOptions,
      isolationSource: Utils.filterDuplicates(
        this.allStrains.map((s) => s.isolationSource).filter((s) => !!s)
      ),
      riskGroup: Utils.filterDuplicates(
        this.allStrains.map((s) => s.riskGroup.toString()).filter((s) => !!s)
      ),
      isolationProvince: Utils.filterDuplicates(
        this.allStrains.map((s) => s.isolationProvince).filter((s) => !!s)
      ),
      isolationSoilTexture: Utils.filterDuplicates(
        this.allStrains.map((s) => s.isolationSoilTexture).filter((s) => !!s)
      ),
      isolationProtocol: Utils.filterDuplicates(
        this.allStrains.map((s) => s.isolationProtocol).filter((s) => !!s)
      ),
    };
  }

  openStrainInformation(strain: Strain): void {
    this.dialog.open(StrainDetailsDialog, {
      width: '600px',
      data: strain,
    });
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
    Utils.exportToCSV(
      this.filteredStrains || [],
      'CCASM-' + Utils.formatDate(new Date()) + '.csv'
    );
  }

  exportAll(): void {
    Utils.exportToCSV(
      this.allStrains,
      'CCASM-' + Utils.formatDate(new Date()) + '.csv'
    );
  }

  clearResults(): void {
    this.filteredStrains = null;
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
  hasChild = (_: number, node: StrainNode): boolean =>
    !!node.children && node.children.length > 0;

  recursiveCount(node: StrainNode): number {
    return node.children.length > 0
      ? node.children.reduce((n, c) => n + this.recursiveCount(c), 0)
      : 1;
  }
}
