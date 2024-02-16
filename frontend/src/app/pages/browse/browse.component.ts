import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { StrainNode } from 'src/app/core/utils/ccasm.types';
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  // constructor(private ccasmService: CCASMService) {}
  searchType: 'simple' | 'complex' = 'simple';
  treeControl = new NestedTreeControl<StrainNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<StrainNode>();

  constructor() {}

  ngOnInit(): void {
    // change this to get the stuff from DB instead
    this.dataSource.data = this.buildTree(data);
  }

  buildTree(data: string[]): StrainNode[] {
    const nodes: StrainNode[] = [];

    data.forEach((entry) => {
      let currentNode: StrainNode | undefined = undefined;

      const parts = entry.split('; ');
      parts.forEach((part) => {
        if (!currentNode) {
          const existingNode = nodes.find((node) => node.name === part);
          if (!existingNode) {
            currentNode = { name: part, children: [] };
            nodes.push(currentNode);
          } else {
            currentNode = existingNode;
          }
        } else {
          const child = currentNode.children.find(
            (c: StrainNode) => c.name === part
          );
          currentNode = child ? child : this.addChild(currentNode, part);
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

  hasChild = (_: number, node: StrainNode) =>
    !!node.children && node.children.length > 0;

  recursiveCount(node: StrainNode): number {
    return node.children.length > 0
      ? node.children.reduce((n, c) => n + this.recursiveCount(c), 0)
      : 1;
  }

  exportToCSV(): void {
    let csvContent = 'Name,Children Count\n';

    this.dataSource.data.forEach((node) => {
      const childrenCount = this.recursiveCount(node);
      csvContent += `${node.name},${childrenCount}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('CSV file generated and downloaded');
  }
}

const data: string[] = [
  'Bacteria; Pseudomonadota1; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium anhuiense',
  'Bacteria; Pseudomonadota2; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium anhuiense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium croatiense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium croatiense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium hidalgonense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium laguerreae',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium laguerreae',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium leguminosarum',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium leguminosarum',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium loessense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium loessense',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium sophoriradicis',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium sophoriradicis',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; unclassified Rhizobium',
  'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; unclassified Rhizobium',
];
