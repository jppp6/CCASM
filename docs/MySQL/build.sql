CREATE DATABASE ccasmDB;
USE ccasmDB;

CREATE TABLE strains(
    ccasm_id SMALLINT NOT NULL AUTO_INCREMENT, -- Maybe?
    strain_name VARCHAR(128),
    binomial_classification VARCHAR(128),
    taxonomic_lineage TINYTEXT,
    risk_group INT,
    is_plant_pathogen boolean,
    colony_morphology VARCHAR(128),
    host_plant_species VARCHAR(128),
    isolation_source VARCHAR(64),
    isolation_year INT,
    isolation_protocol VARCHAR(25),
    isolation_growth_medium VARCHAR(128), -- Link to PDF
    isolation_growth_temperature INT, -- Could be a float?
    isolation_growth_medium_composition VARCHAR(128), 
    isolation_soil_ph FLOAT,
    isolation_soil_organic_matter VARCHAR(128),
    isolation_soil_texture VARCHAR(128),
    isolation_soil_province VARCHAR(2),
    longitude FLOAT,
    latitude FLOAT,
    genome_ncbi_association VARCHAR(128),
    genome_size FLOAT,
    notes TINYTEXT,
    citation_deposit_time DATETIME,
    photo VARCHAR(1024),
    PRIMARY KEY(ccasm_id)
);



CREATE TABLE deposits(
    deposit_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    affiliation VARCHAR(64),
    email VARCHAR(64),
    message TINYTEXT,
    deposit_excel MEDIUMBLOB,
    deposit_state varchar(16),
    deposit_creation_date DATETIME,
    PRIMARY KEY(deposit_id)
);

CREATE TABLE requests(
    request_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    affiliation VARCHAR(64),
    email VARCHAR(64),
    message TINYTEXT,
    request_state VARCHAR(16),
    request_creation_date DATETIME,
    PRIMARY KEY(request_id)
);
