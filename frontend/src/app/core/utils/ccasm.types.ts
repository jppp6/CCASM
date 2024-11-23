export interface Strain {
    strainId: number;
    ccasmId: string;
    strainName: string;
    binomialClassification: string;
    taxonomicLineage: string;
    riskGroup: number;
    isPlantPathogen: string;
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
    isolationSoilProvince:
        | 'AB'
        | 'BC'
        | 'MB'
        | 'NB'
        | 'NL'
        | 'NS'
        | 'NT'
        | 'NU'
        | 'ON'
        | 'PE'
        | 'QC'
        | 'SK'
        | 'YT';
    longitude: number;
    latitude: number;
    genomeNcbiAssociation: string;
    genomeSize: number;
    notes: string;
    citation: string;
    photo: string;
    visible: boolean;
}

export interface StrainLocation {
    isolationSoilProvince:
        | 'AB'
        | 'BC'
        | 'MB'
        | 'NB'
        | 'NL'
        | 'NS'
        | 'NT'
        | 'NU'
        | 'ON'
        | 'PE'
        | 'QC'
        | 'SK'
        | 'YT';
    longitude: number;
    latitude: number;
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
    strainsRequested: string;
    requestState: 'received' | 'processed' | 'sent' | 'refused';
    requestCreationDate: Date;
}

export interface StrainNode {
    name: string;
    children: StrainNode[];
}

export interface Status {
    status: boolean;
    message: string | undefined;
}
