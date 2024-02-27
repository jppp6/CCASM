export interface Strain {
  ccasmId: number;
  strainName: string;
  binomialClassification: string;
  taxonomicLineage: string;
  riskGroup: number;
  isPlantPathogen: boolean;
  colonyMorphology: string;
  hostPlantSpecies: string;
  isolationSource: string;
  isolationYear: number;
  isolationProtocol: string;
  isolationGrowthMedium: string;
  isolationGrowthTemperature: number;
  isolationGrowthMediumComposition: string;
  isolationProvince: string;
  isolationGpsCoordinates: string;
  isolationSoilPh: string;
  isolationSoilOrganicMatter: string;
  isolationSoilTexture: string;
  isolationOther: string;
  genomeNcbiAccessions: string;
  genomeSize: number;
  notes: string;
  citationAtTimeOfDeposit: string;
  photo: string;
}

export interface StrainDeposit {
  depositId: number;
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  message: string;
  depositExcel: string;
  depositState: 'received' | 'processed' | 'added' | 'refused';
  depositCreationDate: Date;
}

export interface StrainRequest {
  requestId: number;
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  message: string;
  strainsRequested: number[];
  requestState: 'received' | 'processed' | 'sent' | 'refused';
  requestCreationDate: Date;
}

export interface StrainNode {
  name: string;
  children: StrainNode[];
}
