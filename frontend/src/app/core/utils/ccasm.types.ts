export interface Strain {
  ccasmId: number;
  strainName: string;
  binomialClassification: string;
  taxonomicLineage: string;
  riskGroup: number;
  isPlantPathogen: number;
  colonyMorphology: string;
  hostPlantSpecies: string;
  isolationSource: string;
  isolationYear: number;
  isolationProtocol: string;
  isolationGrowthMedium: string;
  isolationGrowthTemperature: number;
  isolationGrowthMediumComposition: string;
  isolationSoilPh: number;
  isolationSoilOrganicMatter: string;
  isolationSoilTexture: string;
  isolationSoilProvince: string;
  longitude: number;
  latitude: number;
  genomeNcbiAssociation: string;
  genomeSize: number;
  notes: string;
  citation: string;
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

export interface AdminAccount {
  adminId: number;
  email: string;
  password: string;
  creationDate: Date;
}
