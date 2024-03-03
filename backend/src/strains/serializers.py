from .models import Strains
from rest_framework.serializers import ModelSerializer

class StrainSerializer(ModelSerializer):
    class Meta:
        model = Strains
        fields = (
            'ccasm_id', 
            'strain_name',
            'binomial_classification',
            'taxonomic_lineage',
            'risk_group',
            'is_plant_pathogen',
            'colony_morphology',
            'host_plant_species',
            'isolation_source',
            'isolation_year',
            'isolation_protocol',
            'isolation_growth_medium',
            'isolation_growth_temperature',
            'isolation_growth_medium_composition',
            'isolation_soil_ph',
            'isolation_soil_organic_matter',
            'isolation_soil_texture',
            'isolation_soil_province',
            'longitude',
            'latitude',
            'genome_ncbi_association',
            'genome_size',
            'notes',
            'citation_deposit_time',
            'photo'
        )




