import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { StrainDetailsDialog } from 'src/app/components/strain-details/strain-details.component';
import { Strain, StrainNode } from 'src/app/core/utils/ccasm.types';
import { Utils } from 'src/app/core/utils/ccasm.utils';
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  treeControl = new NestedTreeControl<StrainNode>((node) => node.children);
  treeDataSource = new MatTreeNestedDataSource<StrainNode>();

  searchType: 'simple' | 'complex' = 'simple';

  filteredStrains: Strain[] | null = null;
  allStrains: Strain[] = [];

  simpleOptions: string[] = [];
  complexOptions!: {
    binomialClassification: string[];
    isolationProvince: string[];
    isolationSource: string[];
    isolationSoilTexture: string[];
    riskGroup: string[];
    isolationProtocol: string[];
  };

  ngOnInit(): void {
    // change this to get the stuff from DB instead
    this.allStrains = Utils.snackCaseToCamelCase(allData);

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
    if (searchString === '') {
      this.filteredStrains = null;
    } else {
      this.filteredStrains = this.allStrains.filter((s) =>
        s.binomialClassification.includes(searchString)
      );
    }
  }

  complexSearch(searchParams: { [key: string]: string | null }): void {
    Object.keys(searchParams).forEach((key) => {
      const value = searchParams[key];
      searchParams[key] = typeof value === 'string' ? value.toLowerCase() : '';
    });

    this.filteredStrains = this.allStrains.filter((s) =>
      Object.keys(searchParams).every((key) => {
        const v = searchParams[key];
        return v && (s as any)[key].toString().toLowerCase().includes(v);
      })
    );
  }

  exportFiltered(): void {
    Utils.exportToCSV(this.filteredStrains || [], 'strains.csv');
  }

  exportAll(): void {
    Utils.exportToCSV(this.allStrains || [], 'strains.csv');
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

const allData = [
  {
    ccasm_id: 1,
    strain_name: 'QUR0207',
    binomial_classification: 'Rhizobium anhuiense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium anhuiense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'BioProject XXX, SRA YYY',
    genome_size: 7295560.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 2,
    strain_name: 'QUR0209',
    binomial_classification: 'Rhizobium anhuiense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium anhuiense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'BioProject XXX, SRA YYY',
    genome_size: 7536820.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 3,
    strain_name: 'QUR0011',
    binomial_classification: 'Rhizobium croatiense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium croatiense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'BioProject XXX',
    genome_size: 7230030.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 4,
    strain_name: 'QUR0016',
    binomial_classification: 'Rhizobium croatiense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium croatiense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'BioProject XXX',
    genome_size: 6633250.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 5,
    strain_name: 'QUR0172',
    binomial_classification: 'Rhizobium hidalgonense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium hidalgonense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'SRA YYY',
    genome_size: 6872180.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 6,
    strain_name: 'QUR0112',
    binomial_classification: 'Rhizobium laguerreae',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium laguerreae',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: 6.5,
    isolation_soil_organic_matter: '4',
    isolation_soil_texture: 'Loam',
    isolation_province: 'ON',
    longitude: 44.2313,
    latitude: 76.481,
    genome_ncbi_association: 'SRA YYY',
    genome_size: 7596900.0,
    notes: 'N/A',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 7,
    strain_name: 'QUR0159',
    binomial_classification: 'Rhizobium laguerreae',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium laguerreae',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 7596560.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 8,
    strain_name: 'QUR0024',
    binomial_classification: 'Rhizobium leguminosarum',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium leguminosarum',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 6981660.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 9,
    strain_name: 'QUR0028',
    binomial_classification: 'Rhizobium leguminosarum',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium leguminosarum',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 7435090.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 10,
    strain_name: 'QUR0056',
    binomial_classification: 'Rhizobium loessense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium loessense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 7262800.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 11,
    strain_name: 'QUR0080',
    binomial_classification: 'Rhizobium loessense',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium loessense',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 7260600.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 12,
    strain_name: 'QUR0001',
    binomial_classification: 'Rhizobium sophoriradicis',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium sophoriradicis',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 6899010.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 13,
    strain_name: 'QUR0002',
    binomial_classification: 'Rhizobium sophoriradicis',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; Rhizobium sophoriradicis',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 6896370.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 14,
    strain_name: 'QUR0029',
    binomial_classification: 'Rhizobium sp.',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; unclassified Rhizobium',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 6858340.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
  {
    ccasm_id: 15,
    strain_name: 'QUR0042',
    binomial_classification: 'Rhizobium sp.',
    taxonomic_lineage:
      'Bacteria; Pseudomonadota; Alphaproteobacteria; Hyphomicrobiales; Rhizobiaceae; Rhizobium; unclassified Rhizobium',
    risk_group: 1,
    is_plant_pathogen: 0,
    colony_morphology: 'Pale and mucoidy',
    host_plant_species: 'Phaseolus vulgaris',
    isolation_source: 'Nodule',
    isolation_year: 2023,
    isolation_protocol: 'Nodule trapping',
    isolation_growth_medium: 'TY',
    isolation_growth_temperature: 28,
    isolation_growth_medium_composition:
      '5 g/L tryptone, 2.5 g/L yeast extract, 10 mM CaCl2',
    isolation_soil_ph: null,
    isolation_soil_organic_matter: '',
    isolation_soil_texture: '',
    isolation_province: 'ON',
    longitude: null,
    latitude: null,
    genome_ncbi_association: '',
    genome_size: 7208080.0,
    notes: '',
    citation_deposit_time: null,
    photo: '',
  },
];
